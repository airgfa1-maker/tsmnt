import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 创建上传目录: ${uploadDir}`);
}

// 为图片库创建一个专用的上传文件夹
const galleryDir = path.join(uploadDir, 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
  console.log(`📁 创建图片库目录: ${galleryDir}`);
}

/**
 * 创建图片库上传处理器
 */
const createGalleryUpload = () => {
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, galleryDir);
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `gallery-${uniqueSuffix}${ext}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req: any, file: any, cb: any) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
      }
    }
  });
};

const galleryUpload = createGalleryUpload();

/**
 * 获取所有图片列表（支持分页）
 * GET /api/admin/gallery?offset=0&limit=12
 */
router.get('/admin/gallery', authMiddleware, (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 12;

    const files = fs.readdirSync(galleryDir);
    const allImages = files.map(filename => ({
      filename,
      url: `/uploads/gallery/${filename}`,
      uploadedAt: new Date(fs.statSync(path.join(galleryDir, filename)).mtime)
    })).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    const paginatedImages = allImages.slice(offset, offset + limit);

    res.json({
      code: 200,
      message: 'Success',
      data: paginatedImages,
      total: allImages.length,
      offset,
      limit
    });

  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch gallery', error: error.message });
  }
});

/**
 * 上传图片
 * POST /api/admin/gallery/upload
 */
router.post('/admin/gallery/upload', authMiddleware, (req: Request, res: Response, next: any) => {
  galleryUpload.single('image')(req, res, (err: any) => {
    if (err) {
      // Multer 错误处理
      console.error(`❌ Multer 错误:`, err.message);
      return res.status(400).json({
        code: 400,
        message: err.message,
        error: err.message
      });
    }

    try {
      console.log(`📤 收到图片上传请求`);
      console.log(`  文件: ${req.file?.originalname}`);
      console.log(`  大小: ${req.file?.size}`);
      console.log(`  MIME: ${req.file?.mimetype}`);

      if (!req.file) {
        console.warn(`⚠️ 没有文件上传`);
        return res.status(400).json({ code: 400, message: 'No file uploaded' });
      }

      const imageUrl = `/uploads/gallery/${req.file.filename}`;
      console.log(`✅ 上传成功: ${imageUrl}`);

      res.json({
        code: 200,
        message: 'Image uploaded successfully',
        data: {
          filename: req.file.filename,
          url: imageUrl,
          size: req.file.size,
          uploadedAt: new Date()
        }
      });
    } catch (error: any) {
      console.error(`❌ 上传错误:`, error);
      res.status(500).json({ 
        code: 500, 
        message: 'Failed to upload image', 
        error: error.message 
      });
    }
  });
});

/**
 * 删除图片
 * DELETE /api/admin/gallery/:filename
 */
router.delete('/admin/gallery/:filename', authMiddleware, (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(galleryDir, filename);

    // 安全检查：确保文件在 gallery 目录内
    if (!filePath.startsWith(galleryDir)) {
      return res.status(400).json({ code: 400, message: 'Invalid filename' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ code: 404, message: 'Image not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ code: 200, message: 'Image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to delete image', error: error.message });
  }
});

/**
 * 创建相册记录
 * POST /api/admin/gallery
 */
router.post('/admin/gallery', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, image } = req.body;
    
    if (!title || !image) {
      return res.status(400).json({ code: 400, message: 'Missing required fields: title, image' });
    }

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const gallery = await prisma.gallery.create({
      data: { title, image }
    });

    await prisma.$disconnect();
    
    res.status(201).json({ 
      code: 200, 
      message: 'Gallery item created successfully',
      data: gallery 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to create gallery item', error: error.message });
  }
});

/**
 * 更新相册记录
 * PUT /api/admin/gallery/:id
 */
router.put('/admin/gallery/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, image } = req.body;

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const gallery = await prisma.gallery.update({
      where: { id },
      data: { title, image }
    });

    await prisma.$disconnect();

    res.json({ 
      code: 200, 
      message: 'Gallery item updated successfully',
      data: gallery 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to update gallery item', error: error.message });
  }
});

/**
 * 获取单个相册记录
 * GET /api/admin/gallery/:id
 */
router.get('/admin/gallery/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const gallery = await prisma.gallery.findUnique({
      where: { id }
    });

    await prisma.$disconnect();

    if (!gallery) {
      return res.status(404).json({ code: 404, message: 'Gallery item not found' });
    }

    res.json({ 
      code: 200, 
      message: 'Success',
      data: gallery 
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch gallery item', error: error.message });
  }
});

/**
 * 删除相册记录
 * DELETE /api/admin/gallery/:id
 */
router.delete('/admin/gallery/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    await prisma.gallery.delete({
      where: { id }
    });

    await prisma.$disconnect();

    res.json({ code: 200, message: 'Gallery item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to delete gallery item', error: error.message });
  }
});

/**
 * 获取所有相册列表（分页）
 * GET /api/gallery?page=1&pageSize=12
 */
router.get('/gallery', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 12;
    const skip = (page - 1) * pageSize;

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const [data, total] = await Promise.all([
      prisma.gallery.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.gallery.count()
    ]);

    await prisma.$disconnect();

    res.json({
      code: 200,
      message: 'Success',
      data,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch gallery', error: error.message });
  }
});

export default router;
