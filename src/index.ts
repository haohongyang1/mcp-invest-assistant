import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";

import {registerSayHello} from "./tools/sayHello.js";
import {registerGetIndexTemperature} from "./tools/getIndexTemperature.js";

// 创建MCP服务器
const server = new McpServer({
    name: "mcp-invest-assistant",
    version: "0.0.6",
    capabilities: {
        resources: {},
        tools: {},
    },
});

async function startServer() {

    // 注册所有工具
    registerSayHello(server);
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
startServer();
