#!/usr/bin/env node

import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import logger from './utils/logger.js';
import {registerGetIndexTemperature} from "./tools/getIndexTemperature.js";
import {registerGetCompanyCandlestick} from "./tools/getCompanyCandlestick.js";
import {registerGetCompanyFundamental} from "./tools/getCompanyFundamental.js";

import allBaseInfo from './resource/allBaseInfo.js';
import allCompanyBaseInfo from './resource/allCompanyBaseInfo.js';

// 创建MCP服务器
const server = new McpServer({
    name: "mcp-invest-assistant",
    description: "投资助手，理财分析师",
    version: "0.0.6",
    capabilities: {
        resources: {},
        tools: {},
    }
});


// 灌入基础数据：这里暂时不使用，直接使用提前下载好的数据喂给LLM
// async function getBaseData() {
//     logger.info('start get index base data...');
//     const allPromise = Object.values(MARKET).map((market) => getIndexBaseInfo({market}));
//     const resBody = await Promise.all(allPromise);
//     const allIndexData = Object.keys(MARKET).map((marketCn, index) => {
//         return {
//             marketCn: marketCn,
//             data: resBody?.[index]?.data
//         }
//     });
//     logger.info(`get index base data success: ${JSON.stringify(allIndexData)}`);
//     return allIndexData;
// }
// const allIndexData = await getBaseData();

server.resource('allIndexData', 'data://all-index-data', async (uri) => ({
    contents: [{uri: uri.href, text: JSON.stringify(allBaseInfo)}],
}));

server.resource('allCompanyData', 'data://all-company-data', async (uri) => ({
    contents: [{uri: uri.href, text: JSON.stringify(allCompanyBaseInfo)}],
}));

async function startServer() {
    try {
        logger.info('Registering tools...');

        // 注册所有工具
        // registerSayHello(server);
        // 指数温度计算
        registerGetIndexTemperature(server);
        // 公司K线数据
        registerGetCompanyCandlestick(server);
        // 公司基本面数据
        registerGetCompanyFundamental(server);
        // 公司财务报表
        // 公司股东人数 & 大股东高管增减持
        // 资金流向

        // 经营数据 & 营收构成
        // 股权质押 & 大宗交易
        // 行业 & 指数信息
        // 龙虎榜数据
        // 公告&监管信息


        logger.info('Tools registered successfully');

        // 启动MCP服务器
        logger.info('Starting MCP server with StdioServerTransport...');
        const transport = new StdioServerTransport();

        await server.connect(transport);
        logger.info('MCP server connected successfully');
    } catch (error: unknown) {
        const err = error as Error;
        logger.error(`MCP server startup failed: ${err.message}`);
        logger.error(`Stack trace: ${err.stack}`);
        console.error('服务器启动失败:', err);
        process.exit(1);
    }
}

logger.info('mcp-invest-assistant start success!');
startServer();
