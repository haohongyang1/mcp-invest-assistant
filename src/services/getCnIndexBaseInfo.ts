import axios from "axios";
import {ETFInfomation, BaseRequestBody} from '../types/index.js';
import {TOKEN, API} from '../config/index.js';
import logger from "../utils/logger.js";
import * as data from './etfList.js';

/**
 * 获取A股指数基础信息
 */
const getCnIndexBaseInfo = ({stockCodes}: ETFInfomation) => {
    return new Promise((resolve) => {
        const bodyData: BaseRequestBody = {
            token: TOKEN
        }
        if (Array.isArray(stockCodes) && stockCodes.length > 0) {
            bodyData.stockCodes = stockCodes;
        }

        try {
            logger.info(`请求地址：${API.CN_INDEX_BASE}`);
            logger.info(`参数：${JSON.stringify(bodyData)}`);
            // resolve(data);
            axios.post(API.CN_INDEX_BASE, bodyData)
                .then(res => {
                    // 只记录响应的data部分，避免循环引用问题
                    logger.info(`返回数据状态码: ${res.status}`);
                    logger.info(`返回数据: ${JSON.stringify(res.data)}`);
                    resolve(res.data);
                }).catch(e => {
                    // 对错误对象进行安全处理
                    logger.info(`Error: ${e.message || '未知错误'}`);
                    if (e.response) {
                        logger.info(`Error status: ${e.response.status}`);
                        logger.info(`Error data: ${JSON.stringify(e.response.data)}`);
                    }
                    resolve([]);
                });
        } catch (err) {
            logger.info(err);
            resolve([]);
        }
    });
}
export default getCnIndexBaseInfo;