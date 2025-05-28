import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import getFundamentalData from "../services/getFundamentalData.js";
import logger from "../utils/logger.js";
import {FundamentalResponseBody, FundamentalResponseData} from "../types/index.js";
import percentRank from '../utils/percentRank.js';

// 获取最新指数温度
export function registerGetIndexTemperature(server: McpServer) {
    server.tool(
        'mcp_get_index_temperature',
        '获取最新指数温度',
        {
            'stock_codes': z.array(z.string()).describe('指数代码数组，必传，数组长度大于0，格式如下：["000016"]')
        },
        async ({stock_codes}: {stock_codes: string[]}) => {
            if (Array.isArray(stock_codes) && stock_codes.length > 0) {
                const res: FundamentalResponseBody = await getFundamentalData({stockCodes: stock_codes});

                const fundamentalData = res.data;

                const peList = fundamentalData.map((item) => item['pe_ttm.mcw']);
                const pbList = fundamentalData.map((item) => item['pb.mcw']);

                const pePercentRank = percentRank(peList, fundamentalData[0]['pe_ttm.mcw']);
                const pbPercentRank = percentRank(pbList, fundamentalData[0]['pb.mcw']);
                logger.info(`pePercentRank=== ${pePercentRank}`);
                logger.info(`pbPercentRank=== ${pbPercentRank}`);
                const percentHeat = (pePercentRank + pbPercentRank) / 2;
                const temperature = (percentHeat * 100).toFixed(2);
                return {
                    content: [
                        {
                            type: "text",
                            text: `${stock_codes[0]}的指数温度是${temperature}`
                        }
                    ]
                }
            } else {
                return {
                    content: [
                        {
                            type: "text",
                            text: "参数异常：必须要传入指数代码数组"
                        }
                    ]
                }
            }

        }
    );
}