import { describe, expect, test } from '@vtex/shoreline-test-utils'
import { joinDataForIntervalChart } from '../utils/chart'
import type { SeriesOption } from 'echarts'

describe('Interval hook tests', () => {
  test('Basic transformation', () => {
    const initialOptions = {
      //biome-ignore format: matrix shoulnd't be formatted
      series: [
        { data: [30, 30, 30, 40, 30, 40, 45, 25], name: 'max' },
        { data: [10, 20, 15, 20,  5, 30, 15, 15], name: 'min' },
      ],
      xAxis: { data: ['同', '性', '恋', '阳', '平', '声', '上', '下'] },
    }
    const expectedData = [
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
    const transformedSeries = joinDataForIntervalChart(initialOptions)
      .series as SeriesOption
    expect(transformedSeries.data).toStrictEqual(expectedData)
  })
})
