import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../utils/logger.js";
import {MARKET, FS_TABLE_TYPE} from "../config/index.js";
import {CompanyFinancialStatementParam} from '../types/index.js';
import getFinancialStatementData from '../services/getCompanyFinancialStatement.js';
import allCompanyBaseInfo from '../resource/allCompanyBaseInfo.js';

/**
 * 获取公司财务报表数据工具
 */
export function registerGetCompanyFinancialStatement(server: McpServer) {
  server.tool(
    'mcp_get_company_financial_statement',
    '获取公司财务报表数据',
    {
      'stockCode': z.string().describe(
        '股票代码，必传，从资源中选择，保留原始stockCode'
      ),
      'marketCn': z.string().describe(
        `市场，必传，可选值：A股、港股，注意这里不支持获取美股公司数据`
      ),
      'fsTableType': z.string().describe(
        `公司类型，必传，可选值：${Object.keys(FS_TABLE_TYPE).join('、')}`
      ),
      'startDate': z.string().describe(
        '信息起始时间。用于获取一定时间范围内的数据。开始和结束的时间间隔不超过10年，必传，String: YYYY-MM-DD(北京时间)'
      ),
      'endDate': z.string().describe(
        '信息结束时间。用于获取一定时间范围内的数据。默认值是上周一，可选，String: YYYY-MM-DD(北京时间)'
      ),
      'metricsList': z.array(z.string()).describe(
        '财务指标数组，必传，如：revenue、net_profit等'
      ),
    },
    async ({
      marketCn,
      stockCode,
      startDate,
      endDate,
      fsTableType,
      metricsList
    }: CompanyFinancialStatementParam) => {
      const token = process.env.TOKEN || '';

      if (!token) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：必须要传入token"
            }
          ]
        }
      }
      if (!(marketCn in MARKET)) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：必须要传入市场类型"
            }
          ]
        }
      }
      // 校验一下stockCode是否合法
      const companyInfo = allCompanyBaseInfo.find(
        item => item.marketCn === marketCn
      );
      const stockInfo = companyInfo?.data.find(
        item => +item.stockCode === +stockCode
      );

      logger.info(`stockInfo: ${JSON.stringify(stockInfo)}`)

      if (!stockInfo) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：传入的股票代码不存在，请重新确认"
            }
          ]
        }
      }

      // 校验一下fsTableType是否合法
      if (!(fsTableType in FS_TABLE_TYPE)) {
        return {
          content: [
            {
              type: "text",
              text: "参数异常：公司类型不属于枚举值范围内，请重新传入"
            }
          ]
        }
      }

      const resBody = await getFinancialStatementData({
        stockCodes: [stockInfo.stockCode],
        market: MARKET[marketCn],
        fsTableType,
        startDate,
        endDate,
        token,
        metricsList
      });
      const resData = JSON.stringify(resBody.data);
      return {
        content: [
          {
            type: "text",
            text: resData
          }
        ]
      }
    }
  );
}
