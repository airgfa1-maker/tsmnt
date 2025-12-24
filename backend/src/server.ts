import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import contentRoutes from './routes/content.js';
import galleryRoutes from './routes/gallery.js';
import settingsRoutes from './routes/settings.js';
import mapRoutes from './routes/map.js';
// import statsRoutes from './routes/stats.js';  // 禁用：pageView 模型未定义
import { ensureUploadDirs, uploadHandlers } from './services/UploadService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';
const PORT = process.env.PORT || 3001;

// 确保上传目录存在
ensureUploadDirs();

// 获取uploadDir用于静态文件服务
// __dirname 在 dist 目录中，所以 ../uploads 指向 backend/uploads
const uploadDir = path.join(__dirname, '../uploads');
console.log(`📁 uploadDir: ${uploadDir}`);
console.log(`📁 uploadDir exists: ${fs.existsSync(uploadDir)}`);

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(uploadDir));

// 为向后兼容性，从uploadHandlers中提取单一的upload对象
// 用于server.ts中的旧路由定义
const upload = uploadHandlers.products; // 默认使用products handler

// 全局日志中间件 - 记录所有请求
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const query = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : '';
  console.log(`[${timestamp}] 📌 ${method} ${path} ${query}`);
  next();
});

// 认证中间件
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ code: 401, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ code: 401, message: 'Invalid token' });
  }
};

// 健康检查
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ code: 200, message: 'OK', timestamp: new Date().toISOString() });
});

// ===== 独立上传端点 =====
// 这些端点必须定义在路由模块之前，以避免被 catch-all 路由捕获

// 上传案例图片
app.post('/api/uploads/cases', authMiddleware, uploadHandlers.cases.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: 'No file uploaded' });
    }
    res.json({ 
      code: 200, 
      message: 'Case image uploaded successfully', 
      path: `/uploads/cases/${req.file.filename}` 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Upload failed', error: error.message });
  }
});

// 上传产品图片
app.post('/api/uploads/products', authMiddleware, uploadHandlers.products.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: 'No file uploaded' });
    }
    res.json({ 
      code: 200, 
      message: 'Product image uploaded successfully', 
      path: `/uploads/products/${req.file.filename}` 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Upload failed', error: error.message });
  }
});

// 上传新闻图片
app.post('/api/uploads/news', authMiddleware, uploadHandlers.news.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: 'No file uploaded' });
    }
    res.json({ 
      code: 200, 
      message: 'News image uploaded successfully', 
      path: `/uploads/news/${req.file.filename}` 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Upload failed', error: error.message });
  }
});

// 上传文档
app.post('/api/uploads/documents', authMiddleware, uploadHandlers.documents.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: 'No file uploaded' });
    }
    res.json({ 
      code: 200, 
      message: 'Document uploaded successfully', 
      path: `/uploads/documents/${req.file.filename}` 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Upload failed', error: error.message });
  }
});

// 上传图库图片
app.post('/api/uploads/gallery', authMiddleware, uploadHandlers.hero.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: 'No file uploaded' });
    }
    res.json({ 
      code: 200, 
      message: 'Gallery image uploaded successfully', 
      path: `/uploads/index/${req.file.filename}` 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Upload failed', error: error.message });
  }
});

// ===== 使用路由模块 =====
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', contentRoutes);
app.use('/api', galleryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/map', mapRoutes);
// app.use('/api/stats', statsRoutes);  // 禁用：pageView 模型未定义
console.log('📚 已注册路由: /api/admin/gallery*');
console.log('⚙️  已注册路由: /api/settings/*');
console.log('🗺️  已注册路由: /api/map/*');

// ===== 认证 API =====

// 登录
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
      res.json({
        code: 200,
        message: 'Login success',
        data: { token, username }
      });
    } else {
      res.status(401).json({ code: 401, message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// ===== 产品 API =====

// 获取所有产品
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ code: 200, message: 'Success', data: products });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 获取单个产品
app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    if (!product) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }
    res.json({ code: 200, message: 'Success', data: product });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 获取产品列表（需要认证）
app.get('/api/admin/products', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    const total = await prisma.product.count();

    res.json({
      code: 200,
      message: 'Success',
      data: products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 获取单个产品（需要认证）
app.get('/api/admin/products/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }
    res.json({ code: 200, message: 'Success', data: product });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 创建产品
app.post('/api/admin/products', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { name, model, description, content, categoryId, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await prisma.product.create({
      data: {
        name,
        model: model || '',
        description: description || '',
        content: content || '',
        categoryId,
        price: price ? parseFloat(price) : null,
        image: imageUrl
      },
      include: { category: true }
    });

    res.status(201).json({ code: 201, message: 'Product created', data: product });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 更新产品
app.put('/api/admin/products/:id', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { name, model, description, content, categoryId, price, oldImage } = req.body;
    let imageUrl = undefined;
    
    // 如果有新文件上传
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // 删除旧图片
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', oldImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        model,
        description,
        content,
        categoryId,
        price: price ? parseFloat(price) : undefined,
        ...(imageUrl && { image: imageUrl })
      },
      include: { category: true }
    });

    res.json({ code: 200, message: 'Product updated', data: product });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 删除产品
app.delete('/api/admin/products/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ code: 200, message: 'Product deleted', data: product });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// ===== 产品分类 API =====

// 获取所有分类
app.get('/api/product-categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.productCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ code: 200, message: 'Success', data: categories });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 创建分类
app.post('/api/admin/product-categories', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.productCategory.create({
      data: { name }
    });
    res.status(201).json({ code: 201, message: 'Category created', data: category });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 更新分类
app.put('/api/admin/product-categories/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.productCategory.update({
      where: { id: req.params.id },
      data: { name }
    });
    res.json({ code: 200, message: 'Category updated', data: category });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// 删除分类
app.delete('/api/admin/product-categories/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const category = await prisma.productCategory.delete({
      where: { id: req.params.id }
    });
    res.json({ code: 200, message: 'Category deleted', data: category });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// ===== 案例 API =====

app.get('/api/cases', async (req: Request, res: Response) => {
  try {
    const cases = await prisma.case.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ code: 200, message: 'Success', data: cases });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.get('/api/cases/:id', async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.findUnique({ where: { id: req.params.id } });
    if (!c) return res.status(404).json({ code: 404, message: 'Case not found' });
    res.json({ code: 200, message: 'Success', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/cases', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const c = await prisma.case.create({
      data: {
        title,
        description,
        content: content || '',
        image: imageUrl
      }
    });
    res.status(201).json({ code: 201, message: 'Case created', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/cases/:id', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const c = await prisma.case.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        content,
        ...(imageUrl && { image: imageUrl })
      }
    });
    res.json({ code: 200, message: 'Case updated', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.delete('/api/admin/cases/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.delete({ where: { id: req.params.id } });
    res.json({ code: 200, message: 'Case deleted', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// ===== 新闻 API =====

app.get('/api/news', async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ code: 200, message: 'Success', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.get('/api/news/:id', async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!news) return res.status(404).json({ code: 404, message: 'News not found' });
    res.json({ code: 200, message: 'Success', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/news', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const news = await prisma.news.create({
      data: { title, content, image: imageUrl }
    });
    res.status(201).json({ code: 201, message: 'News created', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/news/:id', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const news = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        ...(imageUrl && { image: imageUrl })
      }
    });
    res.json({ code: 200, message: 'News updated', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.delete('/api/admin/news/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ code: 200, message: 'News deleted', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// ===== 文档 API =====

app.get('/api/documents', async (req: Request, res: Response) => {
  try {
    const docs = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ code: 200, message: 'Success', data: docs });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.get('/api/documents/:id', async (req: Request, res: Response) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!doc) return res.status(404).json({ code: 404, message: 'Document not found' });
    res.json({ code: 200, message: 'Success', data: doc });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/documents', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const doc = await prisma.document.create({
      data: { title, content: content || '', file: fileUrl }
    });
    res.status(201).json({ code: 201, message: 'Document created', data: doc });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/documents/:id', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const doc = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        ...(fileUrl && { file: fileUrl })
      }
    });
    res.json({ code: 200, message: 'Document updated', data: doc });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.delete('/api/admin/documents/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const doc = await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ code: 200, message: 'Document deleted', data: doc });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// ===== 消息 API =====

app.get('/api/messages', async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ code: 200, message: 'Success', data: messages });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    const msg = await prisma.message.create({
      data: { name, email, phone: phone || '', message }
    });
    res.status(201).json({ code: 201, message: 'Message sent', data: msg });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/messages/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const msg = await prisma.message.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ code: 200, message: 'Message updated', data: msg });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

app.delete('/api/admin/messages/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const msg = await prisma.message.delete({ where: { id: req.params.id } });
    res.json({ code: 200, message: 'Message deleted', data: msg });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Server error', error: error.message });
  }
});

// ===== 首页管理 API =====

// 获取所有Hero幻灯片（按顺序）或获取单个（通过query参数id）
app.get('/api/home/hero-slides', async (req: Request, res: Response) => {
  console.log('📥 GET /api/home/hero-slides 被调用', 'query:', req.query);
  try {
    // 如果有id参数，获取单个幻灯片
    if (req.query.id) {
      const slide = await (prisma as any).homeHeroSlide.findUnique({
        where: { id: req.query.id as string }
      });
      if (!slide) {
        return res.status(404).json({ error: 'Hero幻灯片不存在' });
      }
      console.log('✅ 返回单个Hero幻灯片');
      return res.json(slide);
    }

    // 否则获取所有幻灯片
    const slides = await (prisma as any).homeHeroSlide.findMany({
      orderBy: { order: 'asc' }
    });
    console.log('✅ 返回 ' + slides.length + ' 条Hero幻灯片');
    res.json(slides);
  } catch (error) {
    console.error('获取Hero幻灯片失败:', error);
    res.status(500).json({ error: 'Failed to fetch hero slides' });
  }
});

// 创建Hero幻灯片
app.post('/api/home/hero-slides', authMiddleware, uploadHandlers.hero.single('image'), async (req: Request, res: Response) => {
  console.log('📥 POST /api/home/hero-slides 被调用');
  console.log('📬 Content-Type:', req.headers['content-type']);
  console.log('📦 请求体:', req.body);
  console.log('📎 文件:', req.file ? { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size } : '无文件');
  try {
    const { title, subtitle, link, order, active } = req.body;
    
    if (!title || !subtitle || !link) {
      console.log('❌ 缺少必填字段');
      return res.status(400).json({ error: '标题、副标题和链接为必填项' });
    }

    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/index/${req.file.filename}`;
      console.log('✅ 图片已保存:', imagePath);
    }

    const slide = await (prisma as any).homeHeroSlide.create({
      data: {
        title,
        subtitle,
        image: imagePath,
        link,
        order: parseInt(order) || 0,
        active: active === 'true' || active === true
      }
    });

    console.log('✅ Hero幻灯片已创建:', slide.id);
    res.status(201).json(slide);
  } catch (error) {
    console.error('❌ 创建Hero幻灯片失败:', error);
    res.status(500).json({ error: 'Failed to create hero slide' });
  }
});

// 更新Hero幻灯片（支持 :id 路径参数和 ?id 查询参数）
app.put('/api/home/hero-slides', authMiddleware, uploadHandlers.hero.single('image'), async (req: Request, res: Response) => {
  try {
    console.log('📝 PUT /api/home/hero-slides 被调用');
    console.log('📦 query:', req.query);
    console.log('📎 body:', req.body);
    console.log('📄 file:', req.file ? req.file.filename : 'no file');
    
    // 从路径参数或查询参数获取id
    let id = (req as any).params?.id || req.query.id;
    
    if (!id) {
      console.log('❌ 缺少id参数');
      return res.status(400).json({ error: '缺少id参数' });
    }

    const { title, subtitle, link, order, active, oldImage } = req.body;

    // 获取现有幻灯片
    const existingSlide = await (prisma as any).homeHeroSlide.findUnique({ where: { id } });
    if (!existingSlide) {
      return res.status(404).json({ error: 'Hero幻灯片不存在' });
    }

    let imagePath = existingSlide.image;
    
    // 如果上传了新图片
    if (req.file) {
      imagePath = `/uploads/index/${req.file.filename}`;
      
      // 删除旧图片
      if (oldImage && oldImage !== '') {
        try {
          // 修复：使用uploadDir的相对路径
          const oldPath = path.join(uploadDir, oldImage.replace('/uploads/', ''));
          console.log('🗑️ 尝试删除旧Hero图片:', oldPath);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('✅ 旧Hero图片已删除');
          } else {
            console.log('⚠️ 旧Hero图片不存在:', oldPath);
          }
        } catch (error) {
          console.error('删除旧图片失败:', error);
        }
      }
    }

    const updatedSlide = await (prisma as any).homeHeroSlide.update({
      where: { id },
      data: {
        title: title || existingSlide.title,
        subtitle: subtitle || existingSlide.subtitle,
        image: imagePath,
        link: link || existingSlide.link,
        order: order !== undefined ? parseInt(order) : existingSlide.order,
        active: active !== undefined ? (active === 'true' || active === true) : existingSlide.active
      }
    });

    res.json(updatedSlide);
  } catch (error) {
    console.error('更新Hero幻灯片失败:', error);
    res.status(500).json({ error: 'Failed to update hero slide' });
  }
});

// 保留旧的路由以兼容 :id 格式
app.put('/api/home/hero-slides/:id', authMiddleware, uploadHandlers.hero.single('image'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, link, order, active, oldImage } = req.body;

    // 获取现有幻灯片
    const existingSlide = await (prisma as any).homeHeroSlide.findUnique({ where: { id } });
    if (!existingSlide) {
      return res.status(404).json({ error: 'Hero幻灯片不存在' });
    }

    let imagePath = existingSlide.image;
    
    // 如果上传了新图片
    if (req.file) {
      imagePath = `/uploads/index/${req.file.filename}`;
      
      // 删除旧图片
      if (oldImage && oldImage !== '') {
        try {
          // 修复：使用uploadDir的相对路径
          const oldPath = path.join(uploadDir, oldImage.replace('/uploads/', ''));
          console.log('🗑️ 尝试删除旧Hero图片:', oldPath);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('✅ 旧Hero图片已删除');
          } else {
            console.log('⚠️ 旧Hero图片不存在:', oldPath);
          }
        } catch (error) {
          console.error('删除旧图片失败:', error);
        }
      }
    }

    const updatedSlide = await (prisma as any).homeHeroSlide.update({
      where: { id },
      data: {
        title: title || existingSlide.title,
        subtitle: subtitle || existingSlide.subtitle,
        image: imagePath,
        link: link || existingSlide.link,
        order: order !== undefined ? parseInt(order) : existingSlide.order,
        active: active !== undefined ? (active === 'true' || active === true) : existingSlide.active
      }
    });

    res.json(updatedSlide);
  } catch (error) {
    console.error('更新Hero幻灯片失败:', error);
    res.status(500).json({ error: 'Failed to update hero slide' });
  }
});

// 删除Hero幻灯片（支持 :id 路径参数和 ?id 查询参数）
app.delete('/api/home/hero-slides', authMiddleware, async (req: Request, res: Response) => {
  try {
    // 从路径参数或查询参数获取id
    let id = (req as any).params?.id || req.query.id;
    
    if (!id) {
      return res.status(400).json({ error: '缺少id参数' });
    }

    const slide = await (prisma as any).homeHeroSlide.findUnique({ where: { id } });
    if (!slide) {
      return res.status(404).json({ error: 'Hero幻灯片不存在' });
    }

    // 删除图片文件
    if (slide.image) {
      try {
        // 修复：使用uploadDir的相对路径
        const imagePath = path.join(uploadDir, slide.image.replace('/uploads/', ''));
        console.log('🗑️ 尝试删除Hero图片:', imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('✅ Hero图片已删除');
        } else {
          console.log('⚠️ Hero图片不存在:', imagePath);
        }
      } catch (error) {
        console.error('删除图片失败:', error);
      }
    }

    await (prisma as any).homeHeroSlide.delete({ where: { id } });
    res.json({ message: 'Hero幻灯片已删除' });
  } catch (error) {
    console.error('删除Hero幻灯片失败:', error);
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

// 保留旧的路由以兼容 :id 格式
app.delete('/api/home/hero-slides/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const slide = await (prisma as any).homeHeroSlide.findUnique({ where: { id } });
    if (!slide) {
      return res.status(404).json({ error: 'Hero幻灯片不存在' });
    }

    // 删除图片文件
    if (slide.image) {
      try {
        // 修复：使用uploadDir的相对路径
        const imagePath = path.join(uploadDir, slide.image.replace('/uploads/', ''));
        console.log('🗑️ 尝试删除Hero图片:', imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('✅ Hero图片已删除');
        } else {
          console.log('⚠️ Hero图片不存在:', imagePath);
        }
      } catch (error) {
        console.error('删除图片失败:', error);
      }
    }

    await (prisma as any).homeHeroSlide.delete({ where: { id } });
    res.json({ message: 'Hero幻灯片已删除' });
  } catch (error) {
    console.error('删除Hero幻灯片失败:', error);
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

// 获取关于部分
app.get('/api/home/about', async (req: Request, res: Response) => {
  try {
    let about = await (prisma as any).homeAbout.findFirst();
    if (!about) {
      // 如果不存在，创建默认记录
      about = await (prisma as any).homeAbout.create({
        data: {
          title: '电磁技术赋能全球制造',
          content: '20年深耕电磁技术领域，为1000+企业提供可靠的工业解决方案。',
          image: ''
        }
      });
    }
    res.json(about);
  } catch (error) {
    console.error('获取About失败:', error);
    res.status(500).json({ error: 'Failed to fetch about' });
  }
});

// 更新关于部分（需要认证）
app.put('/api/home/about', authMiddleware, uploadHandlers.hero.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, content, oldImage } = req.body;

    let about = await (prisma as any).homeAbout.findFirst();
    
    let imagePath = about?.image || '';
    
    if (req.file) {
      imagePath = `/uploads/index/${req.file.filename}`;
      
      // 删除旧图片
      if (oldImage && oldImage !== '') {
        try {
          const oldPath = path.join(__dirname, '../../' + oldImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (error) {
          console.error('删除旧图片失败:', error);
        }
      }
    }

    if (about) {
      const updated = await (prisma as any).homeAbout.update({
        where: { id: about.id },
        data: {
          title: title || about.title,
          content: content || about.content,
          image: imagePath
        }
      });
      res.json(updated);
    } else {
      const created = await (prisma as any).homeAbout.create({
        data: {
          title: title || '企业介绍',
          content: content || '',
          image: imagePath
        }
      });
      res.json(created);
    }
  } catch (error) {
    console.error('更新About失败:', error);
    res.status(500).json({ error: 'Failed to update about' });
  }
});

// 获取首页产品卡片
app.get('/api/home/product-cards', async (req: Request, res: Response) => {
  try {
    const cards = await (prisma as any).homeProductCard.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json(cards);
  } catch (error) {
    console.error('获取产品卡片失败:', error);
    res.status(500).json({ error: 'Failed to fetch product cards' });
  }
});

// 规格翻译功能已移除

// 全局错误处理中间件 - 必须在所有路由定义之后
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ 全局错误处理:', {
    message: err.message,
    code: err.code,
    status: err.status,
    path: req.path,
    method: req.method
  });
  
  if (err instanceof multer.MulterError) {
    console.error('📤 Multer错误:', err.code, err.message);
    return res.status(400).json({ error: 'Upload error: ' + err.message });
  }
  
  // 处理fileFilter中的自定义错误
  if (err.message && (err.message.includes('Only image files are allowed') || err.message.includes('Only document files are allowed'))) {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }
  
  res.status(err.status || 500).json({ 
    error: 'Server error',
    message: err.message 
  });
});

// 404处理
app.use((req: Request, res: Response) => {
  console.warn(`⚠️  404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found', path: req.path });
});

// 启动服务器
const startServer = async () => {
  try {
    console.log('🔄 正在连接数据库...');
    await prisma.$connect();
    console.log('✅ 数据库已连接');

    console.log('🔄 正在启动Express服务器...');
    const server = app.listen(PORT, () => {
      console.log(`✅ 服务运行在 http://localhost:${PORT}`);
      console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
      console.log('📝 已注册路由: /api/home/hero-slides');
    });

    server.on('error', (err: any) => {
      console.error('❌ 服务器监听错误:', err.message);
      process.exit(1);
    });

    // 服务器现在在监听 - 保持进程运行
    console.log('✅ 服务器已启动并在运行');
  } catch (error: any) {
    console.error('❌ 启动失败:', error.message || error);
    process.exit(1);
  }
};

console.log('🚀 开始启动服务...');
startServer();

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n收到SIGINT信号，正在关闭...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('❌ 未捕获的异常:', err);
  process.exit(1);
});
