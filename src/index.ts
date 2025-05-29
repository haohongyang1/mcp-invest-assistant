import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import logger from './utils/logger.js';
import {registerGetIndexTemperature} from "./tools/getIndexTemperature.js";

import mockAllBaseInfo from './services/mockAllBaseInfo.js';

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
    contents: [{uri: uri.href, text: JSON.stringify(mockAllBaseInfo)}],
}));


async function startServer() {
    // 拿到TOKEN信息
    logger.info(`process.argv: ${process.argv}`);
    // 注册所有工具
    // registerSayHello(server);
    registerGetIndexTemperature(server);

    // 启动MCP服务器
    const transport = new StdioServerTransport();
    try {
        await server.connect(transport);
    } catch (error) {
        console.error('服务器启动失败:', error);
        process.exit(1);
    }
}

logger.info('mcp-invest-assistant start success!');
startServer();
