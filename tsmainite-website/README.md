# 前端应用 - tsmainite 企业网站

Next.js + React + TypeScript + Tailwind CSS 构建的现代企业网站前端

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000`

### 构建生产版本
```bash
npm run build
npm start
```

## 核心功能

### 页面
- **首页** - Hero 轮播、热门内容、特色展示
- **关于我们** - 可编辑的 Markdown 内容，支持 HTML 样式
- **案例** - 案例展示和详情页
- **新闻** - 新闻列表和内容
- **产品** - 产品目录
- **支持/下载** - 文档和资源下载
- **联系我们** - 联系表单 + 百度地图集成

### 管理面板
完整的后台管理系统，支持：
- 登录认证
- 首页编辑（Hero、About、热门内容）
- 案例管理
- 新闻管理
- 产品管理
- 文档管理
- 消息管理
- 网站设置（百度地图 AK、公司信息等）
- 分类管理
- 相册管理

访问: `http://localhost:3000/admin-mnt`  
默认凭证: `admin / admin123`

## 项目结构

```
tsmainite-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 全局布局
│   │   ├── page.tsx                # 首页
│   │   ├── globals.css             # 全局样式
│   │   ├── (home)/                 # 首页路由组
│   │   ├── about/                  # 关于页面
│   │   ├── admin-mnt/              # 管理后台
│   │   │   ├── layout.tsx          # 后台布局
│   │   │   ├── page.tsx            # 仪表盘
│   │   │   ├── hero/               # Hero 编辑
│   │   │   ├── about/              # About 编辑
│   │   │   ├── products/           # 产品管理
│   │   │   ├── news/               # 新闻管理
│   │   │   ├── cases/              # 案例管理
│   │   │   ├── documents/          # 文档管理
│   │   │   ├── gallery/            # 相册管理
│   │   │   ├── categories/         # 分类管理
│   │   │   ├── messages/           # 消息管理
│   │   │   ├── settings/           # 网站设置
│   │   │   ├── login/              # 登录页面
│   │   │   └── ...
│   │   ├── api/                    # API 路由（代理到后端）
│   │   ├── cases/
│   │   ├── news/
│   │   ├── products/
│   │   ├── downloads/
│   │   ├── contact/
│   │   └── support/
│   ├── components/
│   │   ├── Header.tsx              # 头部导航
│   │   ├── Footer.tsx              # 底部
│   │   ├── HeroCarousel.tsx        # 首页轮播
│   │   ├── BaiduMap.tsx            # 百度地图
│   │   ├── ImageUpload.tsx         # 图片上传
│   │   ├── MarkdownContent.tsx     # Markdown 渲染
│   │   ├── Loading.tsx             # 加载动画
│   │   └── admin/                  # 管理组件
│   ├── lib/
│   │   ├── api.ts                  # API 请求工具
│   │   └── admin/
│   │       └── siteInfoApi.ts      # 网站设置 API
│   └── styles/                     # 样式文件
├── public/
│   ├── images/
│   └── robots.txt
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 关键特性

### 内容编辑

#### About 页面
- 完整的 Markdown 编辑器
- 实时预览（分屏）
- 支持 HTML 和内联样式
- 自适应排版

#### 内容管理
- 所有内容（案例、新闻、产品、文档）都支持：
  - 图片上传
  - 富文本编辑
  - 草稿保存
  - 发布管理

### 地图集成
- 百度地图 Web API（WebGL 版本）
- 异步加载脚本
- 坐标配置
- 标记和信息窗口

### 认证系统
- JWT 令牌存储
- 自动 401 处理
- 登出清除 Token

### 响应式设计
- Tailwind CSS v4
- 移动优先
- 暗色主题支持（可扩展）

## API 集成

### 代理配置
所有 `/api` 请求自动代理到 `http://localhost:3001`

在 `next.config.ts` 中配置：
```typescript
rewrites: async () => [
  {
    source: '/api/:path*',
    destination: 'http://localhost:3001/api/:path*'
  },
  {
    source: '/uploads/:path*',
    destination: 'http://localhost:3001/uploads/:path*'
  }
]
```

### 认证请求
```typescript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### 处理 401
自动重定向到登录页面

## 依赖库

主要依赖：
- **Next.js** 16.0.5 - 框架
- **React** 19 - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** 4.0 - 样式
- **react-markdown** - Markdown 渲染
- **remark-gfm** - GitHub Flavored Markdown
- **rehype-raw** - HTML 渲染
- **rehype-sanitize** - HTML 清理

## 环境变量

创建 `.env.local` 文件（可选）：

```env
# 后端 API 地址（开发环境自动通过 next.config.ts 代理）
# NEXT_PUBLIC_API_URL=http://localhost:3001

# 百度地图 AK（从后端 API 获取，无需本地配置）
# NEXT_PUBLIC_BAIDU_MAP_AK=your_ak_here
```

## 开发指南

### 添加新页面
```bash
# 在 src/app 目录创建文件夹和 page.tsx
mkdir src/app/your-page
# 创建 page.tsx
```

### 添加新组件
```bash
# 在 src/components 目录创建
touch src/components/YourComponent.tsx
```

### 样式指南
- 使用 Tailwind CSS 原子类
- 全局样式写在 `globals.css`
- 使用 CSS 模块处理特殊样式
- 充分利用 `@apply` 指令复用样式组合

### Markdown 渲染
```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw, rehypeSanitize]}
  className="markdown-render"
>
  {content}
</ReactMarkdown>
```

## 构建和部署

### 开发构建
```bash
npm run dev
```

### 生产构建
```bash
npm run build
npm start
```

### 静态导出（如需要）
修改 `next.config.ts`：
```typescript
const nextConfig = {
  output: 'export',
  // ...
};
```

## 性能优化

- 图片自动优化（Next.js Image）
- 代码分割（自动）
- 路由预加载
- CSS 压缩

## 常见问题

**地图不显示**
- 检查百度地图 AK 是否配置
- 进入管理后台设置页面配置 AK
- 浏览器控制台检查网络错误

**样式不生效**
- 清除 `.next` 缓存：`rm -rf .next`
- 重新启动开发服务器

**API 请求 401**
- 检查是否登录
- 检查 Token 是否过期（24小时）
- 查看浏览器 localStorage 中的 token

**图片上传失败**
- 检查后端服务是否运行
- 检查上传目录权限
- 查看浏览器控制台错误信息

## 许可证

Internal Use
