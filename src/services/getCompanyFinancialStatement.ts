import axios from "axios";
import {
  FinancialStatementRequestBody,
  FinancialStatementInformation,
  FinancialStatementResponseBody
} from '../types/index.js';
import {COMPANY_FINANCIAL_STATEMENT_MARKET_API} from '../config/index.js';
import logger from "../utils/logger.js";

/**
 * 获取公司财务报表数据
 */
const getFinancialStatementData = ({
  stockCodes,
  market,
  startDate,
  endDate,
  token,
  fsTableType,
  metricsList
}: FinancialStatementInformation): Promise<FinancialStatementResponseBody> => {
  return new Promise((resolve) => {
    const fetchUri = `${COMPANY_FINANCIAL_STATEMENT_MARKET_API[market]}/${fsTableType}`;

    try {
      const bodyData: FinancialStatementRequestBody = {
        token,
        stockCodes,
        startDate,
        endDate,
        metricsList,
      }

      logger.info(`[getFinancialStatementData]请求地址：${fetchUri}`);
      logger.info(
        `[getFinancialStatementData]参数：${JSON.stringify(bodyData)}`
      );

      axios.post(fetchUri, bodyData)
        .then(res => {
          logger.info(
            `[getFinancialStatementData]返回数据状态码: ${res.status}`
          );
          logger.info(
            `[getFinancialStatementData]返回数据: ${JSON.stringify(res.data)}`
          );
          resolve(res.data);
        })
        .catch(e => {
          logger.info(
            `[getFinancialStatementData]Error: ${e.message || '未知错误'}`
          );
          if (e.response) {
            logger.info(
              `[getFinancialStatementData]Error status: ${e.response.status}`
            );
            logger.info(
              `[getFinancialStatementData]Error data: ${JSON.stringify(
                e.response.data
              )}`
            );
          }
          resolve({
            code: 0,
            message: '请求失败',
            data: []
          });
        });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      logger.info(`[getFinancialStatementData]Error: ${errorMessage}`);
      resolve({
        code: 0,
        message: '请求失败',
        data: []
      });
    }
  });
}
export default getFinancialStatementData;
