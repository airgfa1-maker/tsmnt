# 后端服务 - tsmainite 内容管理系统

Express.js + Prisma + SQLite 构建的内容管理系统后端服务

## 快速开始

### 安装依赖
```bash
npm install
```

### 数据库初始化
```bash
# 运行迁移
npx prisma migrate deploy

# （可选）清空并重新填充测试数据
npx ts-node src/seed.ts
```

### 创建管理员用户
```bash
npx ts-node src/create-admin.ts
```
默认凭证：`admin / admin123`

### 启动服务
```bash
# 开发模式（带热重载）
npm run dev

# 生产模式
npm run build
npm start
```

服务运行在 `http://localhost:3001`

## 核心功能

### 认证系统
- JWT 令牌认证（24小时过期）
- SHA256 密码加密
- 登录/密码修改接口

**路由:**
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/change-password` - 修改密码

### 内容管理
- 首页信息（Hero、About、热门内容）
- 案例管理
- 新闻管理
- 产品管理
- 下载资源
- 文档管理
- 消息收集

**路由:**
- `GET/PUT /api/home/*` - 首页内容
- `GET/POST/PUT/DELETE /api/cases` - 案例管理
- `GET/POST/PUT/DELETE /api/news` - 新闻管理
- `GET/POST/PUT/DELETE /api/products` - 产品管理
- `GET/POST/PUT/DELETE /api/documents` - 文档管理

### 文件上传
- 图片上传（案例、新闻、产品、图库）
- 文档上传
- 文件删除

**路由:**
- `POST /api/upload/*` - 上传文件

### 地图配置
- 百度地图集成
- 地址配置管理

**路由:**
- `GET /api/map/config` - 获取地图配置

## 项目结构

```
backend/
├── src/
│   ├── index.ts              # 应用入口
│   ├── server.ts             # 服务器配置
│   ├── create-admin.ts       # 创建管理员脚本
│   ├── seed.ts               # 数据填充脚本
│   ├── middleware/
│   │   └── index.ts          # 中间件（CORS、认证）
│   ├── routes/               # API 路由
│   │   ├── auth.ts
│   │   ├── content.ts
│   │   ├── gallery.ts
│   │   ├── map.ts
│   │   ├── products.ts
│   │   ├── settings.ts
│   │   └── ...
│   ├── services/             # 业务逻辑
│   │   ├── AuthService.ts    # 认证服务
│   │   ├── ContentService.ts # 内容服务
│   │   ├── SiteInfoService.ts
│   │   ├── UploadService.ts
│   │   └── ...
│   └── types/
│       └── index.ts          # TypeScript 类型定义
├── prisma/
│   ├── schema.prisma         # 数据库模式
│   └── migrations/           # 迁移历史
├── uploads/                  # 上传文件存储目录
├── package.json
└── tsconfig.json
```

## 数据库

使用 SQLite + Prisma ORM

### 主要表
- `User` - 管理员用户（密码已加密）
- `SiteInfo` - 网站配置信息
- `HomeHero` - 首页 Hero 块
- `HomeAbout` - 首页 About 块
- `HomePopularContent` - 首页热门内容
- `Case` - 案例
- `News` - 新闻
- `Product` - 产品
- `Document` - 文档
- `Message` - 消息（联系表单）

## 环境配置

创建 `.env` 文件（可选，已有默认值）：

```env
# 数据库
DATABASE_URL="file:./prisma/dev.db"

# 百度地图 API
BAIDU_MAP_AK="你的百度地图AK"

# 端口
PORT=3001
```

## 认证流程

1. **登录**
   ```bash
   POST /api/auth/login
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
   响应包含 JWT token

2. **使用 Token**
   ```
   Authorization: Bearer <token>
   ```

3. **Token 过期处理**
   - 收到 401 响应时需重新登录

## 文件上传

支持上传目录：
- `/uploads/cases/` - 案例图片
- `/uploads/news/` - 新闻图片
- `/uploads/products/` - 产品图片
- `/uploads/gallery/` - 相册图片
- `/uploads/documents/` - 文档文件

上传示例：
```bash
curl -X POST http://localhost:3001/api/upload/cases \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg"
```

## 常见命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产运行
npm start

# 查看数据库
npx prisma studio

# 生成迁移
npx prisma migrate dev --name description

# 重置数据库
npx prisma migrate reset
```

## 故障排除

**密码认证失败**
- 确保已运行 `npx ts-node src/create-admin.ts` 创建管理员
- 检查密码是否正确（默认：admin123）

**文件上传失败**
- 检查 `/uploads` 目录是否存在且可写
- 检查文件大小限制（通常 10MB）

**数据库错误**
- 运行 `npx prisma migrate deploy` 应用迁移
- 或运行 `npx prisma migrate reset` 重置数据库

## API 文档

详见前端 README 中的 API 集成部分。

## 许可证

Internal Use
