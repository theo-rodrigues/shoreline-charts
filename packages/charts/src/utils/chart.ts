import type { EChartsOption, SeriesOption } from 'echarts'
import { CHART_STYLES } from '../theme/chartStyles'
import { type ChartConfig, type ChartUnit, ChartVariants } from '../types/chart'
import { merge } from '@vtex/shoreline-utils'
import { cloneDeep, isArray, isDate } from 'lodash'
import { defaultTheme } from '../theme/themes'

export const buildDefaultSerie = (
  serie: SeriesOption | SeriesOption[],
  defaultStyle: EChartsOption
): SeriesOption => {
  const seriesClone = cloneDeep(serie)
  const defaultStylesClone = cloneDeep(defaultStyle.series)
  const serieMerged = merge(defaultStylesClone, seriesClone) as SeriesOption

  return serieMerged
}

export const formatSeries = (
  series: SeriesOption | SeriesOption[] | undefined,
  defaultStyle: EChartsOption
) => {
  if (!series) return
  if (Array.isArray(series)) {
    return series.map((serie) => buildDefaultSerie(serie, defaultStyle))
  }

  return buildDefaultSerie(series, defaultStyle)
}

const setBarGap = (series: SeriesOption[], size: number) => {
  let bar = 0

  for (let i = 0; i < series.length; i++) if (series[i].type === 'bar') bar++
  if (bar <= 1) return

  let finalPercentage: number
  finalPercentage = 100
  if (size === 1) finalPercentage = 100 / (bar + 2)

  if (size === 2) finalPercentage = 100 / (bar + 1)

  if (size === 3) finalPercentage = 100 / bar

  for (let i = series.length - 1; i > -1; i--) {
    const serie = series[i]
    if (serie.type === 'bar') {
      serie.barCategoryGap = `${finalPercentage.toFixed(0)}%`
    }
  }
}

export const getChartOptions = (
  options: EChartsOption,
  chartConfig: ChartConfig
): EChartsOption | undefined => {
  const { type, variant } = chartConfig
  if (typeof options === 'undefined') return
  const { series, ...rest } = options

  const defaultStyle = getDefaultStyle(type, variant)

  const { series: defaultSeries, ...defaultRest } = defaultStyle
  const formattedSeries = formatSeries(series, defaultStyle)

  if (type === 'bar' && isArray(formattedSeries) && chartConfig.gap)
    setBarGap(formattedSeries, chartConfig.gap)

  const mergedOptions = merge(defaultRest, rest)
  return { ...mergedOptions, series: formattedSeries }
}

/**
 * Returns the default style for that chart type and variant,
 * or the appropriate default variant if the variant is not passed.
 */
function getDefaultStyle(
  type: ChartConfig['type'],
  variant?: ChartConfig['variant']
): EChartsOption {
  if (!variant || !checkValidVariant(type, variant))
    return CHART_STYLES[type][getDefaultByType(type)]

  return CHART_STYLES[type][variant]
}

/**
 * Returns the SeriesOption with the options passed and the config
 * @param multi MultiChart config that will be used to pass
 * @returns SeriesOption correct
 */
export const getDataToChartCompositor = (multi: ChartUnit): SeriesOption => {
  const defaultStyle = getDefaultStyle(
    multi.chartConfig.type,
    multi.chartConfig.variant
  )

  const serieFinal = merge(defaultStyle.series, multi.series) as SeriesOption

  return serieFinal
}

export function applySeriesHook(
  series: SeriesOption[],
  fn: CallableFunction
): SeriesOption[]
export function applySeriesHook(
  series: SeriesOption,
  fn: CallableFunction
): SeriesOption
export function applySeriesHook(
  series: SeriesOption | SeriesOption[],
  fn: CallableFunction
): SeriesOption | SeriesOption[]
export function applySeriesHook(
  series: SeriesOption | SeriesOption[],
  fn: CallableFunction
): SeriesOption | SeriesOption[] {
  if (Array.isArray(series)) {
    return series.map((v: any) => fn(v))
  }
  return fn(series)
}
/**
 * Expects a series array with two series, one of all the lower points
 * and another with all the higher points.
* @example
* series: [
      {
        data: [30, 30, 30, 40, 30, 40, 45, 25],
        name: 'max',
      },
      {
        data: [10, 15, 30, 5, 20, 15, 20, 10],
        name: 'min',
      },
    ],
 * @returns
 */
export function joinDataForIntervalChart(option: EChartsOption): EChartsOption {
  const series = option.series
  const xAxis = option.xAxis as { data: string[] }
  if (typeof series === 'undefined' || !isArray(series)) {
    return option
  }
  if (typeof xAxis === 'undefined' || isArray(xAxis)) {
    return option
  }
  const firstSeriesName = (series[0].name ?? '') as string
  const firstSeriesData = series[0].data as number[]
  const secondSeriesName = (series[1].name ?? '') as string
  const secondSeriesData = series[1].data as number[]
  const categories = xAxis.data

  const data: ([string, number, string] | [])[] = categories.map((c, index) => {
    return [c, firstSeriesData[index], firstSeriesName]
  })
  data.push(
    ...categories
      .slice()
      .reverse()
      .map((c, index): [string, number, string] => {
        return [c, secondSeriesData[index], secondSeriesName]
      })
  )
  data.push([])
  const out = cloneDeep(option)
  out.series = { type: 'custom', data: data }
  return out
}
/**
 * Fix required so that bars with negative values don't render
 * upside down.
 */
export function normalizeBarData(option: EChartsOption): EChartsOption {
  const series = option.series
  if (typeof series === 'undefined') return option
  if (isArray(series)) {
    const out = cloneDeep(option)
    out.series = series.map((v: any) => normalizeBarDataInner(v))
    return out
  }
  const out = cloneDeep(option)
  out.series = normalizeBarDataInner(series)
  return out
}

export function normalizeBarDataInner(series: SeriesOption): SeriesOption {
  const data: any = series.data
  if (data === null || typeof data === 'undefined') return series

  const defaultBorder = defaultTheme.bar.itemStyle.borderRadius
  const invertedBorderRadius = [0, 0, defaultBorder[0], defaultBorder[1]]
  return {
    ...series,
    data: data.map((v) => {
      if (
        typeof v === 'string' ||
        isDate(v) ||
        Array.isArray(v) || // We could allow this case, but i don't think we allow arrays of arrays anywhere
        v === null ||
        typeof v === 'undefined'
      ) {
        return v
      }
      if (typeof v === 'number') {
        return v > 0
          ? v
          : { value: v, itemStyle: { borderRadius: invertedBorderRadius } }
      }
      if (typeof v.value === 'number' && v.value < 0) {
        const out = { ...v }
        out.itemStyle ??= {}
        out.itemStyle.borderRadius = invertedBorderRadius
        return out
      }
      return v
    }),
  }
}

export function normalizeHorizontalBarData(
  option: EChartsOption
): EChartsOption {
  const series = option.series
  if (typeof series === 'undefined') return option
  if (isArray(series)) {
    const out = cloneDeep(option)
    out.series = series.map((v: any) => normalizeHorizontalBarDataInner(v))
    return out
  }
  const out = cloneDeep(option)
  out.series = normalizeHorizontalBarDataInner(series)
  return out
}
export function normalizeHorizontalBarDataInner(
  series: SeriesOption
): SeriesOption {
  if (typeof series === 'undefined' || typeof series.data === 'undefined')
    return {}
  const data: any = series.data
  if (data === null || typeof data === 'undefined') return series

  const defaultBorder = defaultTheme.bar.itemStyle.borderRadius
  const invertedBorderRadius = [defaultBorder[0], 0, 0, defaultBorder[1]]

  return {
    ...series,
    data: data.map((v) => {
      if (
        typeof v === 'string' ||
        isDate(v) ||
        Array.isArray(v) || // We could allow this case, but i don't think we allow arrays of arrays anywhere
        v === null ||
        typeof v === 'undefined'
      ) {
        return v
      }
      if (typeof v === 'number') {
        return v > 0
          ? v
          : { value: v, itemStyle: { borderRadius: invertedBorderRadius } }
      }
      if (typeof v.value === 'number' && v.value < 0) {
        const out = { ...v }
        out.itemStyle ??= {}
        out.itemStyle.borderRadius = invertedBorderRadius
        return out
      }
      return v
    }),
  }
}

/**
 * Returns the tooltip config according to the ChartConfig passed.
 * @param tooltip ChartConfig that will be used to select.
 * @returns EChartsOption['tooltip']
 */
export const getTooltipChartCompositor = (
  tooltip: ChartConfig
): EChartsOption['tooltip'] => {
  return getDefaultStyle(tooltip.type, tooltip.variant).tooltip
}

/**
 * Returns an object containing the xAxis and yAxis props, according to the ChartConfig passed in param.
 * @param background ChartConfig
 * @returns Object containing xAxis, and yAxis props.
 */
export const getBackgroundChartCompositor = (
  background: ChartConfig
): { xAxis: EChartsOption['xAxis']; yAxis: EChartsOption['yAxis'] } => {
  const style = getDefaultStyle(background.type, background.variant)

  return { xAxis: style.xAxis, yAxis: style.yAxis }
}

export function checkValidVariant(type: string, variant?: string): boolean {
  if (!variant) return false
  return ChartVariants[type].variants.includes(variant)
}

export function getDefaultByType(type: ChartConfig['type']): string {
  return ChartVariants[type].default
}
