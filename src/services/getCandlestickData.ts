import axios from "axios";
import {CandidateRequestBody, CandidateInfomation, CandidateResponseBody} from '../types/index.js';
import {COMPANY_MARKET_API} from '../config/index.js';
import logger from "../utils/logger.js";

/**
 * 获取某只股票K线数据（日线、近三年）
 */
const getCandlestickData = ({stockCode, market, startDate, endDate, token}: CandidateInfomation): Promise<CandidateResponseBody> => {
    return new Promise((resolve) => {
        const fetchUri = COMPANY_MARKET_API[market];

        try {
            // resolve(data);
            // return;

            const bodyData: CandidateRequestBody = {
                token,
                stockCode,
                type: 'fc_rights', // 使用前复权
                startDate,
                endDate,
            }

            logger.info(`[getCandlestickData]请求地址：${fetchUri}`);
            logger.info(`[getCandlestickData]参数：${JSON.stringify(bodyData)}`);


            axios.post(fetchUri, bodyData)
                .then(res => {
                    logger.info(`[getCandlestickData]返回数据状态码: ${res.status}`);
                    logger.info(`[getCandlestickData]返回数据: ${JSON.stringify(res.data)}`);
                    resolve(res.data);
                })
                .catch(e => {
                    logger.info(`[getCandlestickData]Error: ${e.message || '未知错误'}`);
                    if (e.response) {
                        logger.info(`[getCandlestickData]Error status: ${e.response.status}`);
                        logger.info(`[getCandlestickData]Error data: ${JSON.stringify(e.response.data)}`);
                    }
                    resolve({
                        code: 0,
                        message: '请求失败',
                        data: []
                    });
                });
        } catch (err) {
            logger.info(`[getCandlestickData]Error: ${err}`);
            resolve({
                code: 0,
                message: '请求失败',
                data: []
            });
        }
    });
}
export default getCandlestickData;