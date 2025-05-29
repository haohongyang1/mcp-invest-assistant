# MCP 投资助手 (mcp-invest-assistant)

一个基于 Model Context Protocol (MCP) 的投资助手服务器，提供 ETF 指数温度计算功能，帮助投资者进行更明智的投资决策。

## 项目简介

MCP 投资助手是一个专为投资者设计的辅助工具，通过计算指数温度来评估市场状态，帮助用户判断 ETF 买入卖出时机。该项目基于 Node.js 和 TypeScript 开发，使用 Model Context Protocol 标准与 AI 助手进行通信。

## 功能特点

- **ETF 温度计算**：基于 PE 和 PB 分位数计算指数综合温度（0-100），帮助判断市场状态
- **多市场支持**：支持 A 股、港股、美股等多个市场的指数温度计算
- **MCP 标准接口**：符合 Model Context Protocol 标准，可与支持 MCP 的 AI 助手无缝集成
- **日志系统**：使用 Winston 进行详细日志记录，便于问题排查和性能监控

## 温度指标解读

指数温度是一个介于 0-100 之间的数值，反映市场的整体估值水平：

- **0-10°**：市场处于寒冬期，估值极低，是最佳买入时机
- **10-20°**：市场开始回暖，仍是良好的买入机会
- **20-30°**：市场状态良好，可继续买入
- **30-40°**：市场趋热，可继续持有但需警惕风险
- **40-50°**：市场较热，考虑逐步卖出
- **>90°**：市场过热，随时有大幅回调风险

## 安装与使用

### 前置条件

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本

### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd mcp-invest-assistant
```

2. 安装依赖
```bash
npm install
```

3. 构建项目
```bash
npm run build
```

4. 启动服务
```bash
npm start
```

开发模式启动（支持热重载）：
```bash
npm run dev
```

## 项目结构

```
mcp-invest-assistant/
├── dist/                # 编译后的 JavaScript 文件
├── src/                 # 源代码
│   ├── config/          # 配置文件
│   ├── services/        # 服务层，包含数据获取和处理逻辑
│   ├── tools/           # MCP 工具定义
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   └── index.ts         # 应用入口文件
├── package.json         # 项目依赖和脚本
└── tsconfig.json        # TypeScript 配置
```

## API 说明

### ETF 温度计算工具

```typescript
// 调用示例
{
  "marketCn": "A股",
  "stockCodes": ["000016"]
}
```

参数说明：
- `marketCn`：市场类型，支持 "A股"、"港股"、"美股" 等
- `stockCodes`：指数代码数组，如 ["000016"] 表示上证50指数

返回格式：
```json
{
  "content": [
    {
      "type": "text",
      "text": "000016的指数温度是45.32"
    }
  ]
}
```

## 技术栈

- **TypeScript**：提供静态类型检查
- **Node.js**：运行环境
- **@modelcontextprotocol/sdk**：MCP 协议实现
- **Axios**：网络请求
- **Winston**：日志记录
- **Zod**：数据验证

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目。请确保遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 ISC 许可证 - 详见 LICENSE 文件
