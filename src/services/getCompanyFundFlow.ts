import axios from "axios";
import {
  FundFlowRequestBody,
  FundFlowInformation,
  FundFlowResponseBody
} from '../types/index.js';
import {
  COMPANY_MUTUAL_MARKET_API,
  COMPANY_MARGIN_TRADING_API,
  FUND_FLOW_TYPE
} from '../config/index.js';
import logger from "../utils/logger.js";

/**
 * 获取公司资金流向数据（互联互通或融资融券）
 */
const getCompanyFundFlow = ({
  stockCode,
  market,
  startDate,
  endDate,
  fundFlowType,
  limit,
  token
}: FundFlowInformation): Promise<FundFlowResponseBody> => {
  return new Promise((resolve) => {
    try {
      let fetchUri = '';

      if (fundFlowType === FUND_FLOW_TYPE['互联互通']) {
        const apiMap = COMPANY_MUTUAL_MARKET_API;
        fetchUri = apiMap[market];
      } else if (fundFlowType === FUND_FLOW_TYPE['融资融券']) {
        const apiMap = COMPANY_MARGIN_TRADING_API;
        fetchUri = apiMap[market];
      } else {
        resolve({
          code: 0,
          message: '资金流向类型不支持',
          data: []
        });
        return;
      }

      if (!fetchUri) {
        resolve({
          code: 0,
          message: '该市场不支持此资金流向类型',
          data: []
        });
        return;
      }

      const bodyData: FundFlowRequestBody = {
        token,
        stockCode,
        startDate,
        endDate,
      };

      if (limit) {
        bodyData.limit = limit;
      }

      logger.info(`[getCompanyFundFlow]请求地址：${fetchUri}`);
      logger.info(`[getCompanyFundFlow]参数：${JSON.stringify(bodyData)}`);

      axios.post(fetchUri, bodyData)
        .then(res => {
          logger.info(`[getCompanyFundFlow]返回数据状态码: ${res.status}`);
          logger.info(
            `[getCompanyFundFlow]返回数据: ${JSON.stringify(res.data)}`
          );
          resolve(res.data);
        })
        .catch(e => {
          logger.info(`[getCompanyFundFlow]Error: ${e.message || '未知错误'}`);
          if (e.response) {
            logger.info(`[getCompanyFundFlow]Error status: ${e.response.status}`);
            logger.info(
              `[getCompanyFundFlow]Error data: ${JSON.stringify(e.response.data)}`
            );
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
      logger.info(`[getCompanyFundFlow]Error: ${err}`);
      resolve({
        code: 0,
        message: '请求失败',
        data: []
      });
    }
  });
};

export default getCompanyFundFlow;
