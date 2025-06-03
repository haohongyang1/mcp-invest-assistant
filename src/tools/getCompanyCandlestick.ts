import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../utils/logger.js";
import {MARKET} from "../config/index.js";
import {CompanyCandlestickParam} from '../types/index.js';
import getCandlestickData from '../services/getCandlestickData.js';
import allCompanyBaseInfo from '../resource/allCompanyBaseInfo.js';

const RIGHT_TYPE = {
    'ex_rights': '不复权',
    'lxr_fc_rights': '理杏仁前复权',
    'fc_rights': '前复权',
    'bc_rights': '后复权'
}
/**
 * 获取公司K线数据工具
 */
export function registerGetCompanyCandlestick(server: McpServer) {
    server.tool(
        'mcp_get_company_candlestick',
        '获取公司K线数据',
        {
            'stockCode': z.string().describe('股票代码，必传，从资源中选择，保留原始stockCode'),
            'marketCn': z.string().describe(`市场，必传，可选值：A股、港股，注意这里不支持获取美股公司数据`),
            // 'type': z.string().describe(`除复权类型，复权计算仅对所选时间段的价格进行复权，成交量不进行复权计算，必传，可选值：${Object.keys(RIGHT_TYPE).join('、')}`),
            'startDate': z.string().describe('信息起始时间。用于获取一定时间范围内的数据。开始和结束的时间间隔不超过10年，必传，String: YYYY-MM-DD(北京时间)'),
            'endDate': z.string().describe('信息结束时间。用于获取一定时间范围内的数据。默认值是上周一，可选，String: YYYY-MM-DD(北京时间)'),
        },
        async ({marketCn, stockCode, startDate, endDate}: CompanyCandlestickParam) => {
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
            const companyInfo = allCompanyBaseInfo.find(item => item.marketCn === marketCn);
            const stockInfo = companyInfo?.data.find(item => +item.stockCode === +stockCode);

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


            const resBody = await getCandlestickData({
                stockCode: stockInfo.stockCode,
                market: MARKET[marketCn],
                // type,
                startDate,
                endDate,
                token
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