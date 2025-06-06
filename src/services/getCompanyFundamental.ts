import axios from "axios";
import {FundamentalRequestBody, FundamentalInfomation, CandidateResponseBody} from '../types/index.js';
import {COMPANY_FUNDAMENTAL_MARKET_API} from '../config/index.js';
import logger from "../utils/logger.js";

/**
 * 获取基本面数据，如PE、PB等
 */
const getFundamentalData = ({stockCodes, market, startDate, endDate, token, fsTableType}: FundamentalInfomation): Promise<CandidateResponseBody> => {
    return new Promise((resolve) => {
        const fetchUri = `${COMPANY_FUNDAMENTAL_MARKET_API[market]}/${fsTableType}`;

        try {
            // resolve(data);
            // return;

            const bodyData: FundamentalRequestBody = {
                token,
                stockCodes,
                startDate,
                endDate,
            }

            logger.info(`[getFundamentalData]请求地址：${fetchUri}`);
            logger.info(`[getFundamentalData]参数：${JSON.stringify(bodyData)}`);


            axios.post(fetchUri, bodyData)
                .then(res => {
                    logger.info(`[getFundamentalData]返回数据状态码: ${res.status}`);
                    logger.info(`[getFundamentalData]返回数据: ${JSON.stringify(res.data)}`);
                    resolve(res.data);
                })
                .catch(e => {
                    logger.info(`[getFundamentalData]Error: ${e.message || '未知错误'}`);
                    if (e.response) {
                        logger.info(`[getFundamentalData]Error status: ${e.response.status}`);
                        logger.info(`[getFundamentalData]Error data: ${JSON.stringify(e.response.data)}`);
                    }
                    resolve({
                        code: 0,
                        message: '请求失败',
                        data: []
                    });
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