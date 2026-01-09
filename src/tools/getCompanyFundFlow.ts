import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../utils/logger.js";
import {MARKET, FUND_FLOW_TYPE} from "../config/index.js";
import {CompanyFundFlowParam} from '../types/index.js';
import getCompanyFundFlow from '../services/getCompanyFundFlow.js';
import allCompanyBaseInfo from '../resource/allCompanyBaseInfo.js';

/**
 * 获取公司资金流向工具
 */
export function registerGetCompanyFundFlow(server: McpServer) {
  server.tool(
    'mcp_get_company_fund_flow',
    '获取公司资金流向数据',
    {
      'stockCode': z.string().describe(
        '股票代码，必传，从资源中选择，保留原始stockCode'
      ),
      'marketCn': z.string().describe(
        '市场，必传，可选值：A股、港股，注意这里不支持获取美股公司数据'
      ),
      'startDate': z.string().describe(
        '信息起始时间。用于获取一定时间范围内的数据。开始和结束的时间间隔不超过10年，必传，String: YYYY-MM-DD(北京时间)'
      ),
      'endDate': z.string().describe(
        '信息结束时间。用于获取一定时间范围内的数据。默认值是上周一，可选，String: YYYY-MM-DD(北京时间)'
      ),
      'fundFlowType': z.string().describe(
        '资金流向类型，必传，可选值：互联互通、融资融券，港股仅支持互联互通数据'
      ),
      'limit': z.number().optional().describe(
        '返回最近数据的数量。该参数会直接透传给API接口，非必传，不传时取API接口默认值，但是可能会存在大量数据，尽可能传递你需要的数据进行限制'
      ),
    },
    async ({
      marketCn,
      stockCode,
      startDate,
      endDate,
      fundFlowType,
      limit
    }: CompanyFundFlowParam) => {
      const token = process.env.TOKEN || '';

      if (!token) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：必须要传入token"
            }
          ]
        };
      }

      if (!(marketCn in MARKET)) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：必须要传入市场类型"
            }
          ]
        };
      }

      if (!(fundFlowType in FUND_FLOW_TYPE)) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：资金流向类型不支持，可选值：互联互通、融资融券"
            }
          ]
        };
      }

      if (fundFlowType === '融资融券' && marketCn === '港股') {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：港股不支持融资融券数据"
            }
          ]
        };
      }

      const companyInfo = allCompanyBaseInfo.find(
        item => item.marketCn === marketCn
      );
      const stockInfo = companyInfo?.data.find(
        item => +item.stockCode === +stockCode
      );

      logger.info(`stockInfo: ${JSON.stringify(stockInfo)}`);

      if (!stockInfo) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：传入的股票代码不存在，请重新确认"
            }
          ]
        };
      }

      const resBody = await getCompanyFundFlow({
        stockCode: stockInfo.stockCode,
        market: MARKET[marketCn],
        startDate,
        endDate,
        fundFlowType: FUND_FLOW_TYPE[fundFlowType as keyof typeof FUND_FLOW_TYPE],
        limit,
        token
      });

      const resData = JSON.stringify(resBody);
      return {
        content: [
          {
            type: "text",
            text: resData
          }
        ]
      };
    }
  );
}
