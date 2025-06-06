import axios from "axios";
import dayjs from 'dayjs';
import {ETFInfomation, IndexFundamentalRequestBody, FundamentalResponseBody} from '../types/index.js';
import {FUNDAMENTAL_MARKET_API} from '../config/index.js';
import logger from "../utils/logger.js";
import data from './mockFundamental.js';

/**
 * 获取指数基本面历史数据，包括A股、港股、美股
 */
const getIndexFundamentalData = ({stockCodes, market, token}: ETFInfomation): Promise<FundamentalResponseBody> => {
    return new Promise((resolve) => {
        const fetchUri = FUNDAMENTAL_MARKET_API[market];
        const bodyData: IndexFundamentalRequestBody = {
            token,
            stockCodes,
            metricsList: [
                "pe_ttm.mcw",
                "pb.mcw"
            ]
        }

        // 设置时间范围：从10年前到现在
        const endDate = dayjs().format('YYYY-MM-DD');
        const startDate = dayjs().subtract(10, 'year').format('YYYY-MM-DD');
        bodyData.startDate = startDate;
        bodyData.endDate = endDate;

        try {
            logger.info(`[getIndexFundamentalData]请求地址：${fetchUri}`);
            logger.info(`[getIndexFundamentalData]参数：${JSON.stringify(bodyData)}`);
            // resolve(data);

            axios.post(fetchUri, bodyData)
                .then(res => {
                    logger.info(`[getIndexFundamentalData]返回数据状态码: ${res.status}`);
                    logger.info(`[getIndexFundamentalData]返回数据: ${JSON.stringify(res.data)}`);
                    resolve(res.data);
                })
                .catch(e => {
                    logger.info(`[getIndexFundamentalData]Error: ${e.message || '未知错误'}`);
                    if (e.response) {
                        logger.info(`[getIndexFundamentalData]Error status: ${e.response.status}`);
                        logger.info(`[getIndexFundamentalData]Error data: ${JSON.stringify(e.response.data)}`);
                    }
                    resolve({
                        code: 0,
                        message: '请求失败',
                        data: []
                    });
                });
        } catch (err) {
            logger.info(`[getIndexFundamentalData]Error: ${err}`);
            resolve({
                code: 0,
                message: '请求失败',
                data: []
            });
        }
    });
}
export default getIndexFundamentalData;