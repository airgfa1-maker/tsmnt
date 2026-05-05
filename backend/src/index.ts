import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requestLogger, errorHandler } from './middleware/index.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import contentRoutes from './routes/content.js';
import galleryRoutes from './routes/gallery.js';
import settingsRoutes from './routes/settings.js';
import mapRoutes from './routes/map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3001;

// 确保上传目录存在
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===== 全局中间件 =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(requestLogger);
app.use('/uploads', express.static(uploadDir));

// ===== 健康检查 =====
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== API 路由 =====

/**
 * 认证路由
 * POST /api/auth/login - 登录
 */
app.use('/api/auth', authRoutes);

/**
 * 产品路由
 * GET /api/products - 获取所有产品
 * GET /api/products/:id - 获取单个产品
 * POST /api/admin/products - 创建产品（需要认证）
 * PUT /api/admin/products/:id - 更新产品（需要认证）
 * DELETE /api/admin/products/:id - 删除产品（需要认证）
 * GET /api/product-categories - 获取所有分类
 * POST /api/admin/product-categories - 创建分类（需要认证）
 * PUT /api/admin/product-categories/:id - 更新分类（需要认证）
 * DELETE /api/admin/product-categories/:id - 删除分类（需要认证）
 */
app.use('/api', productRoutes);

/**
 * 内容路由
 * 案例、新闻、文档、消息、规格翻译
 */
app.use('/api', contentRoutes);

/**
 * 图片库路由
 * GET /api/admin/gallery - 获取所有图片
 * POST /api/admin/gallery/upload - 上传图片
 * DELETE /api/admin/gallery/:filename - 删除图片
 */
app.use('/api', galleryRoutes);
console.log('📚 已注册路由: /api/admin/gallery*');

/**
 * 网站设置路由
 * GET /api/settings/info - 获取网站信息
 * GET /api/settings/contact - 获取联系方式
 * GET /api/settings/social - 获取社交媒体
 * GET /api/settings/company - 获取公司信息
 * GET /api/settings/meta - 获取网站元数据（SEO）
 * GET /api/admin/settings/info - 获取网站信息（后台）
 * PUT /api/admin/settings/info - 更新网站信息（需要认证）
 * GET /api/admin/settings/meta - 获取网站元数据（后台）
 * PUT /api/admin/settings/meta - 更新网站元数据（需要认证）
 */
app.use('/api/settings', settingsRoutes);
console.log('⚙️  已注册路由: /api/settings/* 和 /api/admin/settings/*');

/**
 * 百度地图路由
 * GET /api/map/config - 获取地图配置和API密钥
 * GET /api/map/locations - 获取公司位置信息
 */
app.use('/api/map', mapRoutes);
console.log('🗺️  已注册路由: /api/map/*');

// ===== 错误处理 =====

/**
 * 404 处理
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    code: 404,
    message: 'API endpoint not found',
    path: req.path
  });
});

/**
 * 错误处理中间件
 */
app.use(errorHandler);

// ===== 启动服务器 =====
const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`✅ 服务运行在 http://localhost:${PORT}`);
      console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
      console.log(`📚 API 文档:`);
      console.log(`  - 认证: POST /api/auth/login`);
      console.log(`  - 产品: GET /api/products`);
      console.log(`  - 案例: GET /api/cases`);
      console.log(`  - 新闻: GET /api/news`);
      console.log(`  - 消息: POST /api/messages`);
      console.log(`  - 翻译: GET /api/specs-translations`);
      console.log('');
      console.log(`🔐 管理员登录: admin / admin123`);
    });
    
    // 设置 keep-alive
    server.keepAliveTimeout = 65000;
    return server;
  } catch (error) {
    console.error('❌ 启动失败:', error);
    process.exit(1);
  }
};

let server: any;
(async () => {
  try {
    server = await startServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 服务器正在关闭...');
  if (server) {
    server.close(() => {
      console.log('✅ 服务器已关闭');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

export default app;
