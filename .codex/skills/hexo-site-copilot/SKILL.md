---
name: hexo-site-copilot
description: 用于 Hexo 博客或静态站点的维护、配置、内容编写、主题调整、构建排错与部署。用户提到 Hexo、_config.yml、themes、source、scaffolds、Front-matter、分类标签、hexo generate/server/deploy、GitHub Pages 或其他静态托管部署时使用。
---

# Hexo Site Copilot

## 目标

基于 Hexo 官方文档完成站点初始化、内容维护、主题修改、构建验证与部署调整，优先采用最小改动方案，避免破坏现有生成链路。

## 执行流程

1. 先识别 Hexo 入口文件，至少检查 `package.json`、`_config.yml`、`source/`、`themes/`、`scaffolds/`。
2. 若涉及命令、配置项、Front-matter、主题机制或部署方式不确定，先读取 `references/official-docs.md` 对应章节，再实施修改。
3. 先做最小可验证改动，避免同时改站点配置、主题模板和内容结构三类内容。
4. 涉及主题时，先确认是修改站点根配置、主题配置，还是主题源码，避免改错层级。
5. 修改后至少执行一轮本地验证，优先使用 `hexo generate`，需要预览时再使用 `hexo server`。
6. 涉及部署时，只改部署所需配置，不在代码或文档中硬编码密钥、令牌或私有仓库凭据。

## 常见任务

### 站点初始化

1. 确认 Node.js 与 npm 环境可用。
2. 安装依赖并核对 `package.json` 的 Hexo 相关包。
3. 检查 `_config.yml` 中的 `url`、`root`、`theme`、`deploy`、`skip_render` 等关键项。

### 内容与页面维护

1. 文章和页面默认放在 `source/_posts/` 或 `source/<page>/index.md`。
2. 修改文章前先核对 Front-matter，重点检查 `title`、`date`、`updated`、`tags`、`categories`、`layout`。
3. 分类、标签、归档页面优先遵循现有结构，不随意改 permalink 规则。

### 主题与静态资源

1. 先确认当前主题目录与主题配置文件位置，常见为 `themes/<theme>/_config.yml`。
2. 修改样式或模板前，先确认资源是来自主题 `source/`，还是站点根目录静态资源。
3. 若主题为 Git Submodule，修改后单独检查子模块状态。

### 构建与部署

1. 构建前可按需执行 `hexo clean`，再执行 `hexo generate`。
2. 本地预览使用 `hexo server` 或项目中已有的 npm scripts。
3. 部署方式优先按现有 `deploy` 配置执行；若切换 GitHub Pages、Netlify、Vercel 等托管方式，先核对官方部署章节再改。

## 官方资料使用规则

1. 以 `https://hexo.io/docs/` 为主入口。
2. 优先查这些章节：安装、配置、写作、Front-matter、命令、主题、部署。
3. 引用规则时给出章节链接，不大段复制官方原文。
4. 若官方文档和项目现状冲突，先保留项目现有结构，再做兼容性修正。

## 交付要求

1. 说明改动属于配置、内容、主题还是部署链路。
2. 列出实际修改的文件路径与关键影响。
3. 说明已执行的验证命令与结果。
4. 若存在未验证项，明确指出风险和后续检查点。

## 适用边界

适用于任意包含 Hexo 典型结构的仓库，不绑定单一项目路径。
