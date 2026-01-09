import { FundamentalStatistics } from '../types/index.js';

/**
 * 按周期对数据进行分组
 */
function groupByPeriod(
  data: Array<Record<string, any>>,
  period: 'daily' | 'weekly' | 'monthly'
): Array<Array<Record<string, any>>> {
  if (period === 'daily') {
    return data.map(item => [item]);
  }

  const grouped: Map<string, Array<Record<string, any>>> = new Map();

  data.forEach(item => {
    const date = new Date(item.date);
    let periodKey: string;

    if (period === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      periodKey = weekStart.toISOString().split('T')[0];
    } else {
      periodKey = item.date.substring(0, 7);
    }

    if (!grouped.has(periodKey)) {
      grouped.set(periodKey, []);
    }
    grouped.get(periodKey)!.push(item);
  });

  return Array.from(grouped.values());
}

/**
 * 聚合指标数据
 */
function aggregateMetrics(
  group: Array<Record<string, any>>,
  metricsList: string[]
): Record<string, any> {
  const result: Record<string, any> = {};
  const lastItem = group[group.length - 1];

  result.date = lastItem.date;

  metricsList.forEach(metric => {
    const values = group
      .map(item => item[metric])
      .filter(v => v !== null && v !== undefined && typeof v === 'number');

    if (values.length === 0) {
      result[metric] = lastItem[metric];
      return;
    }

    const isVolumeMetric = ['tv', 'ta', 'fpa', 'fra', 'fnpa',
      'ssa', 'sra', 'snsa'].includes(metric);
    const isPriceMetric = ['sp', 'spc', 'spa'].includes(metric);

    if (isVolumeMetric) {
      result[metric] = values.reduce((sum, v) => sum + v, 0);
    } else if (isPriceMetric) {
      result[metric] = lastItem[metric];
    } else {
      result[metric] = lastItem[metric];
    }
  });

  return result;
}

/**
 * 采样数据
 */
export function sampleData(
  data: Array<Record<string, any>>,
  period: 'daily' | 'weekly' | 'monthly',
  metricsList: string[]
): Array<Record<string, any>> {
  if (period === 'daily') {
    return data;
  }

  const grouped = groupByPeriod(data, period);
  return grouped.map(group => aggregateMetrics(group, metricsList));
}

/**
 * 计算统计指标
 */
export function calculateStatistics(
  data: Array<Record<string, any>>,
  metric: string
): FundamentalStatistics {
  const values = data
    .map(item => item[metric])
    .filter(v => v !== null && v !== undefined && typeof v === 'number');

  if (values.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      latest: 0,
      trend: 'stable'
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const latest = values[values.length - 1];

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (values.length > 1) {
    const firstValue = values[0];
    const change = latest - firstValue;
    const changePercent = (change / Math.abs(firstValue)) * 100;

    if (changePercent > 2) {
      trend = 'up';
    } else if (changePercent < -2) {
      trend = 'down';
    }
  }

  return {
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    avg: Math.round(avg * 100) / 100,
    latest: Math.round(latest * 100) / 100,
    trend
  };
}

/**
 * 生成时间范围字符串
 */
export function generateTimeRange(
  data: Array<Record<string, any>>
): string {
  if (data.length === 0) {
    return '';
  }

  const startDate = data[0].date;
  const endDate = data[data.length - 1].date;

  return `${startDate} ~ ${endDate}`;
}
