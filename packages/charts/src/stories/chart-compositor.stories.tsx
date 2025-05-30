import type { StoryObj } from '@storybook/react'
import { ChartCompositor } from '../index'
import { CHART_COMPOSITOR_DATA } from '../benchmarks/__fixtures__/chartData'

export default {
  title: 'Charts/chart-compositor',
  component: ChartCompositor,
}

type Story = StoryObj<typeof ChartCompositor>

export const Stress: Story = {
  args: {
    charts: [
      {
        series: { data: CHART_COMPOSITOR_DATA.data4_thousand },
        chartConfig: { type: 'line' },
      },
      {
        series: { data: CHART_COMPOSITOR_DATA.data4_thousand },
        chartConfig: { type: 'bar' },
      },
      {
        series: { data: CHART_COMPOSITOR_DATA.data4_thousand },
        chartConfig: { type: 'bar' },
      },
    ],
    tooltip: { type: 'line' },
  },
}

const data1: number[] = []
const data2: number[] = []
const data3: number[] = []

for (let i = 0; i < 25; i++) {
  data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
  data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5)
  data3.push((data1[i] + data2[i]) / 2)
}
export const Basic: Story = {
  args: {
    charts: [
      {
        series: [
          { data: data1, name: 'Bar 1' },
          { data: data2, name: 'Bar 2' },
        ],
        chartConfig: { type: 'bar', variant: 'vertical' },
      },
      {
        series: { data: data3, name: 'Average' },
        chartConfig: { type: 'line', variant: 'default' },
      },
    ],
    tooltip: { type: 'line' },
    zoom: true,
    style: { height: 550 },
  },
}

export const ConfidenceBand: Story = {
  args: {
    charts: [
      {
        chartConfig: { type: 'interval' },
        series: [
          {
            data: [10, 10, 10, 20, 20],
            name: 'Lower bound',
          },
          {
            data: [50, 60, 60, 70, 70],
            name: 'Higher bound',
          },
        ],
      },
      {
        chartConfig: { type: 'line' },
        series: { data: [5, 35, 45, 65, 50], name: 'Trajectory' },
      },
    ],
    tooltip: { type: 'interval' },
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
  },
}
