import type { TooltipComponentFormatterCallbackParams } from 'echarts'
import { renderToStaticMarkup } from 'react-dom/server'
import '../../theme/components/tooltip.css'

export default function ChartTooltip({ params }: ChartTooltipProps) {
  return (
    <>
      <h4 data-sl-chart-tooltip-title>
        {Array.isArray(params) ? params[0].name : params.name}
      </h4>
      <div data-sl-chart-tooltip>
        {Array.isArray(params) ? (
          params.map((param) =>
            isIntervalChart(
              param.seriesType ?? '',
              param.dimensionNames ?? []
            ) ? (
              <IntervalTooltipBase key={param.dataIndex} params={param} />
            ) : (
              <ChartTooltipBase key={param.dataIndex} params={param} />
            )
          )
        ) : (
          <ChartTooltipBase params={params} />
        )}
      </div>
    </>
  )
}

function ChartTooltipBase({ params }: { params: any }) {
  return (
    <div data-sl-chart-tooltip-data-container>
      <div data-sl-chart-tooltip-data-serie-container>
        <span
          data-sl-chart-tooltip-data-serie-label-box
          style={{
            backgroundColor: params.color,
          }}
        />
        <span data-sl-chart-tooltip-data-serie-name>{params.seriesName}</span>
      </div>
      <b>
        <span data-sl-chart-tooltip-data-serie-value>{params.value}</span>
      </b>
    </div>
  )
}

function IntervalTooltipBase({ params }: { params: any }) {
  return (
    <div data-sl-chart-tooltip-data-container>
      <div data-sl-chart-tooltip-data-serie-container>
        <span data-sl-chart-tooltip-data-serie-name>{params.value[2]}</span>
      </div>
      <b>
        <span data-sl-chart-tooltip-data-serie-value>{params.value[1]}</span>
      </b>
    </div>
  )
}

function isIntervalChart(type: string, dimensions: string[]): boolean {
  return (
    type === 'custom' &&
    ['category', 'value', 'Area'].every(
      (value, index) => value === dimensions[index]
    )
  )
}
export const getTooltipStaticString = (
  params: TooltipComponentFormatterCallbackParams
) => renderToStaticMarkup(<ChartTooltip params={params} />)

export interface ChartTooltipProps {
  params: TooltipComponentFormatterCallbackParams
}
