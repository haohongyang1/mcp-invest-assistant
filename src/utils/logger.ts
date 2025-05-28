import winston from "winston";
import path from "path";
import fs from "fs";
import os from 'os';

// const LOGS_DIR = path.join(process.cwd(), 'logs');
const appName = 'mcp-invest-assistant';
// /Users/haohongyang/Documents/mymcpserver/mcp-invest-assistant
const LOGS_DIR = path.join(os.homedir(), 'Documents', 'mymcpserver', appName, 'logs');
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR);
}
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({filename: path.join(LOGS_DIR, 'error.log'), level: 'error'}),
        new winston.transports.File({filename: path.join(LOGS_DIR, 'combined.log')}),
    ],
});

export default logger;