import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../utils/logger.js";

export function registerSayHello(server: McpServer) {
    server.tool(
        'mcp_say_hello',
        '打招呼',
        {
            'no_param': z.string().optional().describe('无参数')
        },
        async () => {
            logger.info('打招呼');
            return {
                content: [
                    {
                        type: "text",
                        text: "不太想和你打招呼哈哈哈"
                    }
                ]
            }
        }
    );
}