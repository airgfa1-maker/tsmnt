# tsmainite 企业网站系统

完整的现代企业网站解决方案，包含前端、后端和内容管理系统。

```
tsmainite/
├── backend/              # Express.js + Prisma 后端服务
├── tsmainite-website/    # Next.js 前端应用
└── README.md            # 本文件
```

## 快速开始

### 1. 启动后端服务

```bash
cd backend

# 安装依赖
npm install

# 初始化数据库
npx prisma migrate deploy

# 创建管理员用户
npx ts-node src/create-admin.ts
# 默认: admin / admin123

# 启动服务（运行在 localhost:3001）
npm run dev
```

### 2. 启动前端应用

```bash
cd tsmainite-website

# 安装依赖
npm install

# 启动开发服务器（运行在 localhost:3000）
npm run dev
```

### 3. 访问应用

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:3001
- **管理后台**: http://localhost:3000/admin-mnt
  - 用户名: `admin`
  - 密码: `admin123`

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端应用 (Next.js)                      │
│              http://localhost:3000                       │
├──────────────────────────────────────────────────────────┤
│ - 企业网站首页                                             │
│ - 产品、案例、新闻展示                                      │
│ - 用户联系表单 + 百度地图                                   │
│ - 后台管理系统                                             │
└──────────────┬──────────────────────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────────────────────┐
│            后端服务 (Express.js + Prisma)                 │
│              http://localhost:3001                       │
├──────────────────────────────────────────────────────────┤
│ - 用户认证 (JWT)                                         │
│ - 内容管理 (CRUD)                                        │
│ - 文件上传                                               │
│ - 数据库 (SQLite)                                        │
└──────────────────────────────────────────────────────────┘
```

## 功能特性

### 前端
- ✅ 响应式设计（移动优先）
- ✅ 首页 Hero 轮播
- ✅ 动态内容加载
- ✅ Markdown 内容编辑（About 页面）
- ✅ 百度地图集成
- ✅ Loading 加载动画
- ✅ 完整的管理后台

### 后端
- ✅ JWT 认证
- ✅ RESTful API
- ✅ 内容管理
- ✅ 文件上传
- ✅ 数据库迁移
- ✅ 错误处理

### 管理功能
- ✅ 首页管理（Hero、About、热门内容）
- ✅ 案例管理
- ✅ 新闻管理
- ✅ 产品管理
- ✅ 文档管理
- ✅ 消息管理
- ✅ 相册管理
- ✅ 分类管理
- ✅ 网站设置（百度地图 AK、公司信息等）

## 技术栈

### 前端
- **框架**: Next.js 16.0.5
- **UI**: React 19 + TypeScript
- **样式**: Tailwind CSS 4.0
- **内容**: react-markdown + 插件
- **地图**: 百度地图 WebGL API

### 后端
- **框架**: Express.js
- **ORM**: Prisma
- **数据库**: SQLite
- **认证**: JWT
- **加密**: SHA256

## 项目详情

### 前端项目
详见 [tsmainite-website/README.md](tsmainite-website/README.md)

### 后端项目
详见 [backend/README.md](backend/README.md)

## 常用命令

### 前端开发
```bash
cd tsmainite-website
npm run dev          # 开发模式
npm run build        # 生产构建
npm start            # 启动生产服务
npm run lint         # 代码检查
```

### 后端开发
```bash
cd backend
npm run dev          # 开发模式（热重载）
npm run build        # TypeScript 编译
npm start            # 启动生产服务

# 数据库命令
npx prisma migrate dev --name 迁移名称  # 创建新迁移
npx prisma migrate deploy               # 应用迁移
npx prisma migrate reset                # 重置数据库
npx prisma studio                       # 数据库可视化工具

# 数据填充
npx ts-node src/seed.ts                # 填充测试数据
npx ts-node src/create-admin.ts        # 创建管理员
```

## 配置管理

### 后端环境变量 (.env)
```env
DATABASE_URL="file:./prisma/dev.db"
BAIDU_MAP_AK="你的百度地图AK"
PORT=3001
```

### 前端环境变量 (.env.local)
```env
# 可选，通常通过 API 自动配置
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 常见问题

### 地图不显示
1. 访问 http://localhost:3000/admin-mnt/settings
2. 在"百度地图 API Key"字段输入有效的 AK
3. 或在后端 .env 文件配置 BAIDU_MAP_AK

### 登录失败
- 确保后端服务运行正常
- 确保已执行 `npx ts-node src/create-admin.ts` 创建管理员
- 检查凭证（默认：admin / admin123）

### 数据库错误
```bash
cd backend
npx prisma migrate reset  # 重置数据库
npx ts-node src/seed.ts   # 重新填充数据
```

### 端口冲突
修改配置文件中的端口号：
- 前端: `next.config.ts`
- 后端: `.env` 中的 PORT 或 `src/server.ts` 中的硬编码

## 部署指南

### 前端部署（Vercel/其他）
```bash
cd tsmainite-website
npm run build
# 上传生成的 .next 文件夹
```

### 后端部署
```bash
cd backend
npm run build
npm start
# 确保数据库文件可写
```

## 开发工作流

1. **启动两个终端**
   - 终端 1: `cd backend && npm run dev`
   - 终端 2: `cd tsmainite-website && npm run dev`

2. **浏览应用**
   - 前端: http://localhost:3000
   - 管理: http://localhost:3000/admin-mnt
   - 后端 API: http://localhost:3001/api/*

3. **修改代码**
   - 前端修改自动热重载
   - 后端修改自动重启

4. **数据库操作**
   - 使用 `npx prisma studio` 可视化管理数据

## 贡献指南

1. 在特性分支上开发
2. 提交清晰的提交信息
3. 确保代码通过 lint 检查
4. 提交 Pull Request

## 许可证

Internal Use

## 联系方式

项目相关问题，请联系开发团队。

---

**最后更新**: 2025年12月24日
