import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../utils/logger.js";
import {MARKET, FS_TABLE_TYPE, METRICS_NAME_CONFIG, GRANULARITY_CONFIG, STATISTICS_DATA_TYPE_CONFIG} from "../config/index.js";
import {CompanyFundamentalParam} from '../types/index.js';
import getFundamental from '../services/getCompanyFundamental.js';
import allCompanyBaseInfo from '../resource/allCompanyBaseInfo.js';


/**
 * 获取公司基本面数据工具
 */
export function registerGetCompanyFundamental(server: McpServer) {
    server.tool(
        'mcp_get_company_fundamental',
        '获取公司基本面数据，如PE、PB等。返回数据包含采样后的时间序列和统计摘要。',
        {
            'stockCode': z.string().describe('股票代码，必传，从资源中选择，保留原始stockCode'),
            'marketCn': z.string().describe(`市场，必传，可选值：A股、港股，注意这里不支持获取美股公司数据`),
            'fsTableType': z.string().describe(`公司类型，必传，可选值：${Object.keys(FS_TABLE_TYPE).join('、')}`),
            'startDate': z.string().describe('信息起始时间。用于获取一定时间范围内的数据。开始和结束的时间间隔不超过10年，必传，String: YYYY-MM-DD(北京时间)'),
            'endDate': z.string().describe('信息结束时间。用于获取一定时间范围内的数据。默认值是上周一，可选，String: YYYY-MM-DD(北京时间)'),
            'metricsList': z.array(z.string()).describe(
              `指标数组，必传。支持两种格式：
              
              1. 基础估值指标（直接指标名）：
              pe_ttm(PE-TTM)、d_pe_ttm(PE-TTM扣非)、pb(PB)、pb_wo_gw(PB不含商誉)、ps_ttm(PS-TTM)、dyr(股息率)、pcf_ttm(PCF-TTM)、sp(股价)、spc(涨跌幅)、spa(股价振幅)、tv(成交量)、ta(成交金额)、to_r(换手率)、shn(总股东人数)、mc(市值)、mc_om(A股市值)、cmc(流通市值)、ecmc(自由流通市值)、ecmc_psh(人均自由流通市值)、fpa(融资买入金额)、fra(融资偿还金额)、fnpa(融资净买入金额)、fb(融资余额)、ssa(融券卖出金额)、sra(融券偿还金额)、snsa(融券净卖出金额)、sb(融券余额)、ha_sh(陆股通持仓股数)、ha_shm(陆股通持仓金额)、mm_nba(陆股通净买入金额)
              
              2. 估值统计指标（复合指标）：格式为 [metricsName].[granularity].[statisticsDataType]
              metricsName：pe_ttm、d_pe_ttm、pb、pb_wo_gw、ps_ttm、dyr
              granularity：fs(上市以来)、y20(20年)、y10(10年)、y5(5年)、y3(3年)、y1(1年)
              statisticsDataType：cvpos(分位点%)、q2v(20%分位点值)、q5v(50%分位点值)、q8v(80%分位点值)、minv(最小值)、maxv(最大值)、maxpv(最大正值)、avgv(平均值)
              
              数据量限制说明：
              - 单次查询最多返回36个月的数据（约3年）
              - 如需更细粒度数据，请使用samplingPeriod参数指定统计周期
              - 返回数据包含：采样后的时间序列 + 统计摘要
              - 建议：如需分析多个指标，建议分次查询（每次5-8个指标）
              
              约束条件：当只查询1只股票时最多36个指标；当查询多只股票时最多48个指标。
              
              示例：["mc", "pe_ttm", "pb", "dyr", "pe_ttm.y3.cvpos", "pb.y5.q5v"]`
            ),
            'samplingPeriod': z.enum(['daily', 'weekly', 'monthly']).optional().describe('数据采样周期，可选，默认为monthly（月）。daily（日）：保留原始日数据；weekly（周）：按周聚合；monthly（月）：按月聚合。采样可显著降低返回数据量（月采样可降低95%）。'),
            'includeStatistics': z.boolean().optional().describe('是否返回统计摘要，可选，默认为true。包含min、max、avg、latest、trend等统计指标，帮助快速了解数据分布和趋势。')
        },
        async ({
          marketCn,
          stockCode,
          startDate,
          endDate,
          fsTableType,
          metricsList,
          samplingPeriod = 'monthly',
          includeStatistics = true
        }: CompanyFundamentalParam) => {
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


            const resBody = await getFundamental({
                stockCodes: [stockInfo.stockCode],
                market: MARKET[marketCn],
                fsTableType,
                startDate,
                endDate,
                token,
                metricsList,
                samplingPeriod,
                includeStatistics
            });
            const resData = JSON.stringify(resBody);
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