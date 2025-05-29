import axios from "axios";
import {ETFInfomation, BaseRequestBody, BaseResponseBody} from '../types/index.js';
import {BASE_MARKET_API} from '../config/index.js';
import logger from "../utils/logger.js";
import * as data from './mockEtfList.js';

/**
 * 获取指数基础信息
 */
const getIndexBaseInfo = ({stockCodes, market, token}: ETFInfomation): Promise<BaseResponseBody> => {
    return new Promise((resolve) => {
        const fetchUri = BASE_MARKET_API[market];

        const bodyData: BaseRequestBody = {
            token
        }
        if (Array.isArray(stockCodes) && stockCodes.length > 0) {
            bodyData.stockCodes = stockCodes;
        }

        try {
            logger.info(`[getIndexBaseInfo]请求地址：${fetchUri}`);
            logger.info(`[getIndexBaseInfo]参数：${JSON.stringify(bodyData)}`);
            // resolve(data);
            axios.post(fetchUri, bodyData)
                .then(res => {
                    logger.info(`[getIndexBaseInfo]返回数据状态码: ${res.status}`);
                    logger.info(`[getIndexBaseInfo]返回数据: ${JSON.stringify(res.data)}`);
                    resolve(res.data);
                }).catch(e => {
                    logger.info(`[getIndexBaseInfo]Error: ${e.message || '未知错误'}`);
                    if (e.response) {
                        logger.info(`[getIndexBaseInfo]Error status: ${e.response.status}`);
                        logger.info(`Error data: ${JSON.stringify(e.response.data)}`);
                    }
                    resolve({
                        code: 0,
                        message: '请求失败',
                        data: []
                    });
                });
        } catch (err) {
            logger.info(`[getIndexBaseInfo]Error: ${err}`);
            resolve({
                code: 0,
                message: '请求失败',
                data: []
            });
        }
    });
}
export default getIndexBaseInfo;