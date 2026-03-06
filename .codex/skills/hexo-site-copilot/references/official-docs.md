# Hexo 官方文档入口

以下链接均来自 Hexo 官方站点 `hexo.io`，优先作为本 skill 的配置、命令和部署依据。

## 核心入口

- 文档首页：https://hexo.io/docs/
- 安装与建站：https://hexo.io/docs/setup
- 配置说明：https://hexo.io/docs/configuration
- 命令说明：https://hexo.io/docs/commands
- 写作与新建内容：https://hexo.io/docs/writing
- Front-matter：https://hexo.io/docs/front-matter
- 主题机制：https://hexo.io/docs/themes
- 一键部署：https://hexo.io/docs/one-command-deployment

## 使用建议

### 初始化或接手旧项目

优先查：

1. `setup`
2. `configuration`
3. `commands`

重点确认：

- Node.js 与 npm 环境
- 依赖安装方式
- `_config.yml` 关键字段
- `hexo clean`
- `hexo generate`
- `hexo server`
- `hexo deploy`

### 写文章、页面、分类标签

优先查：

1. `writing`
2. `front-matter`

重点确认：

- `hexo new` 的生成规则
- 文章与页面的默认目录
- `layout`
- `tags`
- `categories`
- 日期与更新时间字段

### 改主题或样式

优先查：

1. `themes`
2. `configuration`

重点确认：

- 站点配置与主题配置的分层
- 主题目录结构
- 模板与静态资源的来源

### 改部署

优先查：

1. `one-command-deployment`
2. 文档首页中的部署相关插件说明

重点确认：

- `deploy` 字段写法
- 目标托管平台要求
- 部署插件是否已安装

## 本 skill 的保守策略

1. 官方文档未覆盖的项目约定，以仓库现状为准。
2. 涉及主题源码时，先检查项目是否对主题做过二次修改。
3. 涉及部署时，不在仓库中新增敏感凭据。
