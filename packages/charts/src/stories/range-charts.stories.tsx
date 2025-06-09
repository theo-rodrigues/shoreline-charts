import type { StoryObj } from '@storybook/react/*'
import { Chart } from '../components'
import type { EChartsOption } from 'echarts'
import {} from 'lodash'
import { joinDataForRangeChart } from '../utils/chart'

export default {
  title: 'Charts/Range',
  component: Chart,
}

type Story = StoryObj<typeof Chart>

const data = [
  ['同', 30, 'max'],
  ['性', 30, 'max'],
  ['恋', 30, 'max'],
  ['阳', 40, 'max'],
  ['平', 30, 'max'],
  ['声', 40, 'max'],
  ['上', 45, 'max'],
  ['下', 25, 'max'],
  ['下', 15, 'min'],
  ['上', 15, 'min'],
  ['声', 30, 'min'],
  ['平', 5, 'min'],
  ['阳', 20, 'min'],
  ['恋', 15, 'min'],
  ['性', 20, 'min'],
  ['同', 10, 'min'],
  [],
]
export const basic: Story = {
  args: {
    chartConfig: { type: 'range' },
    xAxis: { data: ['A', 'B', 'C', 'D'] },
    series: [
      { data: [10, 25, 10, 15], name: 'min' },
      { data: [20, 30, 40, 35], name: 'max' },
    ],
  },
}
export const Works: Story = {
  args: {
    chartConfig: { type: 'range' },
    xAxis: { data: ['同', '性', '恋', '阳', '平', '声', '上', '下'] },
    series: [
      {
        data: [30, 30, 30, 40, 30, 40, 45, 25],
        name: 'max',
      },
      {
        data: [15, 15, 15, 5, 20, 15, 20, 10],
        name: 'min',
      },
    ],
    // option: { visualMap: { dimension: 1, calculable: true } },
  },
}
export const Transformacoes: Story = {
  render: () => {
    const cu: EChartsOption = {
      series: [
        {
          data: [30, 30, 30, 40, 30, 40, 45, 25],
          name: 'max',
        },
        {
          data: [15, 15, 30, 5, 20, 15, 20, 10],
          name: 'min',
        },
      ],
      xAxis: { data: ['同', '性', '恋', '阳', '平', '声', '上', '下'] },
    }

    console.log(data)
    return <div> {JSON.stringify(joinDataForRangeChart(cu))} </div>
  },
}
export const Custom: Story = {
  render: () => {
    return (
      <Chart
        chartConfig={null}
        option={{
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
            },
            formatter: (params) => {
              // params is an array of objects, one for each data item at the hovered x-axis position
              if (!params || params.length === 0) {
                return ''
              }

              const category = params[0].name // The category name from the first param

              let maxVal: number | string = 'N/A'
              let minVal: number | string = 'N/A'

              // Iterate through the params to find max and min for this category
              params.forEach((param) => {
                const type = param.value[2] // 'max' or 'min'
                const value = param.value[1] // The actual number value

                if (type === 'max') {
                  maxVal = value
                } else if (type === 'min') {
                  minVal = value
                }
              })

              return `
        ${category}<br/>
        Max: ${maxVal}<br/>
        Min: ${minVal}
      `
            },
          },
          legend: {},
        }}
        xAxis={{ data: ['同', '性', '恋', '阳', '平', '声', '上', '下'] }}
        series={[
          {
            data: [10, 25, 15, 30, 45, 40, 35, 20],
            type: 'line',
            name: 'Linha',
          },
          {
            data: data,
            type: 'custom',
            // name: 'Área',
            dimensions: ['category', 'value', 'Area'],
            animationDelayUpdate: 10,
            encode: {
              x: 'category',
              y: 'value',
              itemName: 2,
              seriesName: 2,
              tooltip: 'value',
            },
            renderItem: (params, api) => {
              const context = params.context as {
                points: number[][] | undefined
              }
              console.log(`value is ${api.value(0)}`)
              if (typeof api.value(0) === 'undefined') {
                console.log(context.points)
                return {
                  type: 'polygon',
                  transition: ['shape'],
                  shape: {
                    smooth: 0.3,
                    // smoothConstraint: true,
                    points: context.points,
                  },
                  emphasisDisabled: true,
                  style: {
                    fill: api.visual('color'),
                    stroke: 'rgba(175, 0, 0, 0.1)',
                  },
                }
              }
              context.points ??= []
              context.points.push(api.coord([api.value(0), api.value(1)]))
              console.log(context.points)
              return
            },
          },
        ]}
      />
    )
  },
}
