import type { EChartsOption, SeriesOption } from 'echarts'

const BarChartVariantsArray = ['vertical', 'horizontal'] as const
const LineChartVariantsArray = ['default', 'area'] as const
const IntervalChartVariantsArray = ['default', 'gradient'] as const

export type BarChartVariants = (typeof BarChartVariantsArray)[number]
export type LineChartVariants = (typeof LineChartVariantsArray)[number]
export type IntervalChartVariants = (typeof IntervalChartVariantsArray)[number]
/**
 * Used to check the variants of each chart, making sure is a valid chart.
 * Every variant should be in this object.
 * The object contains the types of chart, that leads to an object that has variants,
 *  which is an array with all variants of that type, and default which is the default variant of that type
 */
export const ChartVariants = {
  line: {
    variants: LineChartVariantsArray,
    default: 'default' as const,
  },

  bar: {
    variants: BarChartVariantsArray,
    default: 'vertical' as const,
  },
  interval: {
    variants: IntervalChartVariantsArray,
    default: 'default' as const,
  },
}

export type LineChartConfig = { type: 'line'; variant?: LineChartVariants }
export type BarChartConfig = {
  type: 'bar'
  variant?: BarChartVariants
  gap?: 1 | 2 | 3
}
export type IntervalChartConfig = {
  type: 'interval'
  variant?: IntervalChartVariants
}

export type ChartConfig = BarChartConfig | LineChartConfig | IntervalChartConfig

export type DefaultChartStyles = {
  bar: Record<BarChartVariants, EChartsOption>
  line: Record<LineChartVariants, EChartsOption>
  interval: Record<IntervalChartVariants, EChartsOption>
}

export type ChartUnit = {
  series: SeriesOption | SeriesOption[]
  chartConfig: ChartConfig
  hooks?: ((series: EChartsOption) => EChartsOption)[] | null
}

export type ChartLoadingConfig = {
  text?: string
  color?: string
  textColor?: string
  fontSize?: number
}
export type DefaultHooks = {
  bar: Record<BarChartVariants, ((series: EChartsOption) => EChartsOption)[]>
  line: Record<LineChartVariants, ((series: EChartsOption) => EChartsOption)[]>
  interval: Record<
    IntervalChartVariants,
    ((series: EChartsOption) => EChartsOption)[]
  >
}
