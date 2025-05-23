import type { StoryObj } from '@storybook/react/*'
import { Chart } from '../components'

export default {
  title: 'Charts/Interval',
  component: Chart,
}

type Story = StoryObj<typeof Chart>

export const basic: Story = {
  args: {
    chartConfig: { type: 'interval' },
    xAxis: { data: ['A', 'B', 'C', 'D'] },
    series: [
      { data: [10, 25, 10, 15], name: 'odio', areaStyle: {} },
      { data: [20, 30, 40, 35], name: 'socorr', areaStyle: {} },
      // { data: [20, 30, 40, 35], areaStyle: { color: 'red' } },
    ],
  },
}
const data = [
  [5, 30],
  [10, 30],
  [15, 30],
  [30, 40],
  [40, 30],
  [50, 40],
  [60, 45],
  [65, 25],
  [65, 10],
  [60, 15],
  [50, 30],
  [40, 5],
  [30, 20],
  [15, 15],
  [10, 20],
  [5, 10],
]
export const Custom: Story = {
  render: () => {
    return (
      <Chart
        chartConfig={null}
        option={{ tooltip: { trigger: 'axis' } }}
        series={[
          // {
          //   data: [10, 25, 15, 30, 45, 40, 35, 20],
          //   type: 'line',
          // },
          {
            data: data,
            type: 'custom',
            dimensions: ['x', 'y'],
            encode: {
              x: 'x',
              y: 'y',
              // tooltip: ['x', 'y'],
            },
            renderItem: (params, api) => {
              const points: number[][] = []
              for (let i = 0; i < data.length; i++) {
                points.push(api.coord(data[i]))
              }
              // points.push(api.coord(api.value(0)))
              return {
                type: 'polygon',
                transition: ['shape'],
                shape: {
                  smooth: 0.3,
                  // smoothConstraint: true,
                  points: points,
                },
                style: {
                  fill: 'rgba(175, 0, 0, 0.1)',
                  stroke: 'rgba(175, 0, 0, 0.1)',
                },
              }
            },
          },
        ]}
      />
    )
  },
}
