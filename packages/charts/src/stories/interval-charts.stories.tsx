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
      { data: [20, 30, 40, 35], name: 'socorr' },
      { data: [10, 25, 40, 45], name: 'odio', areaStyle: {} },
      // { data: [20, 30, 40, 35], areaStyle: { color: 'red' } },
    ],
  },
}
