import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import getFundamentalData from "../services/getFundamentalData.js";
import logger from "../utils/logger.js";
import {FundamentalResponseBody, IndexTemperatureParam} from "../types/index.js";
import percentRank from '../utils/percentRank.js';
import {MARKET} from '../config/index.js';


// 获取最新指数温度
export function registerGetIndexTemperature(server: McpServer) {
    server.tool(
        'mcp_get_index_temperature',
        '定投指数ETF买入卖出时机参考，获取最新指数温度，指数温度越高，说明股市越火爆，风险越大，上涨空间越小。温度越低，说明股市越冷清，风险则越小，上涨空间更大。温度在0-10度之间，代表着股票市场正值寒冬、萎靡不振，这是时候是最佳的买入时机。10-20°之间，代表股票市场开始回暖，蓄势待发，仍然是买入良机。20-30°之间，股票市场欣欣向荣，可以继续买入。30-40℃之间，可以继续持有，提防风险。40-50℃之间，考虑逐步卖出。＞90℃，随时有灰飞烟灭的风险',
        {
            'marketCn': z.string().describe(`市场，必传，可选值：${Object.keys(MARKET).join('、')}`),
            'stockCodes': z.array(z.string()).describe('指数代码数组，必传，数组长度大于0，格式如下：["000016"]')
        },
        async ({stockCodes, marketCn}: IndexTemperatureParam) => {
            // 直接从 process.env 读取环境变量
            const token = process.env.TOKEN || '';
            logger.info(`获取到的TOKEN: ${token}`);

            logger.info(`marketCn: ${marketCn}`);

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
            if (!(MARKET as Record<string, string>)[marketCn]) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "参数异常：必须要传入市场类型"
                        }
                    ]
                }
            }
            if (!Array.isArray(stockCodes) || stockCodes.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "参数异常：必须要传入指数代码数组"
                        }
                    ]
                }
            }


            const batchPromise = await Promise.all(
                stockCodes.map((stockCode) => getFundamentalData({stockCodes: [stockCode], market: MARKET[marketCn], token}))
            );
            const fundamentalDataList = batchPromise.map((res: FundamentalResponseBody) => res.data);
            const heatList = fundamentalDataList.map((fundamentalData) => {
                const peList = fundamentalData.map((item) => item['pe_ttm.mcw']);
                const pbList = fundamentalData.map((item) => item['pb.mcw']);
                const pePercentRank = percentRank(peList, fundamentalData[0]['pe_ttm.mcw']);
                const pbPercentRank = percentRank(pbList, fundamentalData[0]['pb.mcw']);
                const percentHeat = (pePercentRank + pbPercentRank) / 2;
                const temperature = (percentHeat * 100).toFixed(2);
                return {code: fundamentalData[0].stockCode, temperature};
            });

            logger.info(`get heatList detail: ${JSON.stringify(heatList)}`);

            const temperature = heatList.map((item) => `${item.code}的指数温度是${item.temperature}`).join('，');
            logger.info(`response info temperature: ${temperature}`);


            return {
                content: [
                    {
                        type: "text",
                        text: temperature
                    }
                ]
            }
        }
    );
}