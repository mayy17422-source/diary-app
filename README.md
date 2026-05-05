# 📓 日记 · Diary App

一个风格仿 Notion 的全栈日记应用，支持注册登录、富文本编辑、自动保存，数据持久化存储。

## ✨ 功能特性

- 🔐 用户注册 / 登录（JWT 认证，无需邮箱验证）
- 📝 富文本编辑器（支持标题、加粗、斜体、列表、引用、代码等）
- 💾 自动保存（防抖 1 秒）+ 手动保存
- 🗂️ 日记列表，侧边栏展示，点击切换
- 🗑️ 删除日记（二次确认）
- 🔄 刷新不丢失数据（SQLite 持久化 + JWT localStorage）
- 👤 用户数据隔离
- 📱 响应式设计，移动端侧边栏可折叠

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + TailwindCSS |
| 编辑器 | TipTap |
| 后端 | Node.js + Express |
| 数据库 | SQLite (better-sqlite3) |
| 认证 | JWT + bcryptjs |

## 🚀 快速启动

### 1. 安装依赖

```bash
# 安装根目录依赖（concurrently）
npm install

# 安装前后端依赖
cd server && npm install && cd ..
cd client && npm install && cd ..
```

或者直接运行：

```bash
npm run install:all
```

### 2. 启动项目

```bash
npm run dev
```

这将同时启动：
- 🔵 后端：`http://localhost:3001`
- 🟣 前端：`http://localhost:5173`

### 3. 访问应用

打开浏览器访问：**http://localhost:5173**

注册一个账号即可开始使用。

## 📁 项目结构

```
diary-app/
├── package.json          # 根配置，concurrently 并发启动
├── README.md
├── server/
│   ├── package.json
│   ├── index.js          # Express 服务 + 所有 API 路由
│   └── database.db       # SQLite 数据库（首次运行自动生成）
└── client/
    ├── package.json
    ├── vite.config.js    # Vite 配置（含 API 代理）
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx        # 路由入口
        ├── api.js         # API 请求封装
        ├── index.css      # 全局样式 + TipTap 样式
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── AuthPage.jsx   # 登录/注册页
        │   └── DiaryPage.jsx  # 主日记页
        └── components/
            ├── Sidebar.jsx    # 左侧侧边栏
            ├── Editor.jsx     # 富文本编辑区
            └── Toolbar.jsx    # 编辑器工具栏
```

## 🔌 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录，返回 JWT |
| GET | `/api/notes` | 获取日记列表 |
| POST | `/api/notes` | 创建日记 |
| GET | `/api/notes/:id` | 获取单篇日记 |
| PUT | `/api/notes/:id` | 更新日记 |
| DELETE | `/api/notes/:id` | 删除日记 |

## ⚙️ 环境变量（可选）

在 `server/` 目录创建 `.env` 文件：

```env
PORT=3001
JWT_SECRET=your_custom_secret_here
```

不配置时会使用默认值，本地开发无需额外设置。

## 📝 License

MIT
