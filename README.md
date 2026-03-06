# wty.com 项目初始化说明

这是一个以 Hexo 为主体的个人站点仓库，当前包含以下核心内容：

- Hexo 博客主站
- `themes/particle` 主题子模块

## 技术栈

- Node.js 22
- npm 10
- Hexo 8

## 目录说明

- `source/`：Hexo 源内容
- `themes/particle/`：站点主题，Git Submodule
- `public/`：Hexo 构建产物

## 初始化步骤

### 1. 初始化主题子模块

```powershell
git submodule update --init --recursive
```

### 2. 初始化 Node 依赖

```powershell
npm install
```

### 3. 启动 Hexo 本地开发

```powershell
npm run server
```

默认访问地址通常为 `http://localhost:4000`。

### 4. 构建站点

```powershell
npm run build
```

## 当前已确认状态

- `npm run build` 已在 2026-03-07 本地通过

## 维护建议

- 部署前将根目录 `_config.yml` 中的 `url: http://example.com` 改成真实站点地址
- `themes/particle` 当前是独立子模块，修改主题后需要分别检查主仓库与子模块状态
- `public/` 与 `node_modules/` 不应提交到仓库
