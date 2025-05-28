import axios from "axios";
import dayjs from 'dayjs';
import {ETFInfomation, FundamentalRequestBody, FundamentalResponseBody} from '../types/index.js';
import {TOKEN, API} from '../config/index.js';
import logger from "../utils/logger.js";
import data from './fundamental.js';

/**
 * 获取A股指数基本面历史数据
 */
const getFundamentalData = ({stockCodes}: ETFInfomation): Promise<FundamentalResponseBody> => {
    return new Promise((resolve) => {
        const bodyData: FundamentalRequestBody = {
            token: TOKEN,
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
        logger.info(`时间范围: ${startDate} 至 ${endDate}`);

        try {
            logger.info(`请求地址：${API.CN_INDEX_FUNDAMENTAL}`);
            logger.info(`参数：${JSON.stringify(bodyData)}`);
            // resolve(data);

            axios.post(API.CN_INDEX_FUNDAMENTAL, bodyData)
                .then(res => {
                    // 只记录响应的data部分，避免循环引用问题
                    logger.info(`返回数据状态码: ${res.status}`);
                    logger.info(`返回数据: ${JSON.stringify(res.data)}`);
                    resolve(res.data);
                })
                .catch(e => {
                    // 对错误对象进行安全处理
                    logger.info(`Error: ${e.message || '未知错误'}`);
                    if (e.response) {
                        logger.info(`Error status: ${e.response.status}`);
                        logger.info(`Error data: ${JSON.stringify(e.response.data)}`);
                    }
                    resolve({
                        code: 0,
                        message: '请求失败',
                        data: []
                    });
                });
        } catch (err) {
            logger.info(err);
            resolve({
                code: 0,
                message: '请求失败',
                data: []
            });
        }
    });
}
export default getFundamentalData;