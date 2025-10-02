import type { StoryObj } from '@storybook/react/*'
import { Chart } from '../components'
import { registerMap } from '../config'
import worldPopulationData from './data/maps/worldPopulationData'
import worldLow from './data/maps/worldLow.geo.json'

export default {
  title: 'Charts/geospatial',
  component: Chart,
}

type Story = StoryObj<typeof Chart>
const worldData = [
  [-21.9348415, 64.1334671, 14_523],
  [-35.8888, -7.2206, 3_450],
  [-51, -14, 239_823],
  [114.0596, 22.5429, 3_000_000],
  [-74, 40.712, 4_000_000],
]
export const Choropleth3: Story = {
  render: () => {
    registerMap('world', worldLow)
    return (
      <Chart
        chartConfig={null}
        series={[
          {
            type: 'map',
            map: '',
            geoIndex: 0,
            data: worldPopulationData,
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            data: worldData,
            color: 'red',
          },
        ]}
        option={{
          visualMap: [
            {
              min: 1_000_000,
              max: 2_000_000_000,
              dimension: 0,
              seriesIndex: 0,
              // inRange: { color: ['#FAEC6D', '#E57001', '#EC3727'] },
            },
            {
              min: 5000,
              max: 5_000_000,
              dimension: 2,
              seriesIndex: 1,
              left: 'right',
              inRange: {
                symbolSize: [10, 25],
                color: '#EC3727',
              },
            },
          ],
          tooltip: {},
          geo: {
            map: 'world',
            roam: true,
            emphasis: {
              label: {
                show: true,
              },
            },
          },
        }}
        style={{ height: 800 }}
      />
    )
  },
}
