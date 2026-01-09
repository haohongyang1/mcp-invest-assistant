import axios from "axios";
import {
  FundamentalRequestBody,
  FundamentalInfomation,
  CandidateResponseBody,
  FundamentalDataSummary
} from '../types/index.js';
import {COMPANY_FUNDAMENTAL_MARKET_API} from '../config/index.js';
import logger from "../utils/logger.js";
import {
  sampleData,
  calculateStatistics,
  generateTimeRange
} from '../utils/dataSampling.js';

interface ExtendedFundamentalInfomation extends FundamentalInfomation {
  samplingPeriod?: 'daily' | 'weekly' | 'monthly';
  includeStatistics?: boolean;
}

/**
 * 处理返回数据，进行采样和统计
 */
function processResponseData(
  data: Array<Record<string, any>>,
  metricsList: string[],
  samplingPeriod: 'daily' | 'weekly' | 'monthly' = 'monthly',
  includeStatistics: boolean = true
): FundamentalDataSummary | Array<Record<string, any>> {
  if (!includeStatistics || samplingPeriod === 'daily') {
    if (samplingPeriod !== 'daily') {
      return sampleData(data, samplingPeriod, metricsList);
    }
    return data;
  }

  const sampledData = sampleData(data, samplingPeriod, metricsList);

  const statistics: Record<string, any> = {};
  metricsList.forEach(metric => {
    statistics[metric] = calculateStatistics(sampledData, metric);
  });

  const summary: FundamentalDataSummary = {
    summary: {
      dataPoints: sampledData.length,
      timeRange: generateTimeRange(sampledData),
      samplingMethod: samplingPeriod,
      metricsCount: metricsList.length
    },
    statistics,
    timeSeries: sampledData
  };

  return summary;
}

/**
 * 获取基本面数据，如PE、PB等
 */
const getFundamentalData = ({
  stockCodes,
  market,
  startDate,
  endDate,
  token,
  fsTableType,
  metricsList,
  samplingPeriod = 'monthly',
  includeStatistics = true
}: ExtendedFundamentalInfomation): Promise<CandidateResponseBody | FundamentalDataSummary
  | Array<Record<string, any>>> => {
    return new Promise((resolve) => {
        const fetchUri = `${COMPANY_FUNDAMENTAL_MARKET_API[market]}/${fsTableType}`;

        try {
            const bodyData: FundamentalRequestBody = {
                token,
                stockCodes,
                startDate,
                endDate,
                metricsList,
            }

            logger.info(`[getFundamentalData]请求地址：${fetchUri}`);
            logger.info(`[getFundamentalData]参数：${JSON.stringify(bodyData)}`);


            axios.post(fetchUri, bodyData)
                .then(res => {
                    logger.info(`[getFundamentalData]返回数据状态码: ${res.status}`);
                    logger.info(`[getFundamentalData]返回数据: ${JSON.stringify(res.data)}`);

                    if (res.data.code === 1 && res.data.data && Array.isArray(res.data.data)) {
                      const processedData = processResponseData(
                        res.data.data,
                        metricsList,
                        samplingPeriod,
                        includeStatistics
                      );

                      if (includeStatistics && samplingPeriod !== 'daily') {
                        resolve({
                          code: res.data.code,
                          message: res.data.message,
                          data: processedData
                        } as any);
                      } else {
                        resolve({
                          code: res.data.code,
                          message: res.data.message,
                          data: processedData
                        } as any);
                      }
                    } else {
                      resolve(res.data);
                    }
                })
                .catch(e => {
                    logger.info(`[getFundamentalData]Error: ${e.message || '未知错误'}`);
                    if (e.response) {
                        logger.info(`[getFundamentalData]Error status: ${e.response.status}`);
                        logger.info(`[getFundamentalData]Error data: ${JSON.stringify(
                          e.response.data
                        )}`);
                        resolve(e.response.data);
                    } else {
                        resolve({
                            code: 0,
                            message: e.message || '请求失败',
                            data: []
                        });
                    }
                });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '未知错误';
            logger.info(`[getFundamentalData]Error: ${errorMessage}`);
            resolve({
                code: 0,
                message: '请求失败',
                data: []
            });
        }
    });
}
export default getFundamentalData;