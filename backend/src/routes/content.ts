import { Router, Request, Response } from 'express';
import {
  CaseService,
  NewsService,
  MessageService
} from '../services/ContentService.js';
import { authMiddleware } from '../middleware/index.js';
import { uploadHandlers } from '../services/UploadService.js';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = Router();
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

// ===== 案例 API =====

router.get('/cases', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await CaseService.getCasesList(page, pageSize);
    res.json({
      code: 200,
      message: 'Success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch cases', error: error.message });
  }
});

router.get('/cases/featured', async (req: Request, res: Response) => {
  try {
    const cases = await CaseService.getFeaturedCases();
    res.json({
      code: 200,
      message: 'Success',
      data: cases
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch featured cases', error: error.message });
  }
});

router.get('/cases/:id', async (req: Request, res: Response) => {
  try {
    const c = await CaseService.getCaseById(req.params.id);
    if (!c) return res.status(404).json({ code: 404, message: 'Case not found' });
    res.json({ code: 200, message: 'Success', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch case', error: error.message });
  }
});

// Admin 端点：获取案例列表（需认证）
router.get('/admin/cases', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await CaseService.getCasesList(page, pageSize);
    res.json({
      code: 200,
      message: 'Success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch cases', error: error.message });
  }
});

// Admin 端点：获取单个案例（需认证）
router.get('/admin/cases/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const c = await CaseService.getCaseById(req.params.id);
    if (!c) return res.status(404).json({ code: 404, message: 'Case not found' });
    res.json({ code: 200, message: 'Success', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch case', error: error.message });
  }
});

router.post('/admin/cases', authMiddleware, uploadHandlers.cases.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description, content, industry, company, featured, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/cases/${req.file.filename}` : null;

    const c = await CaseService.createCase({
      title,
      description,
      content: content || '',
      image: imageUrl,
      industry,
      company,
      featured: featured === 'true' || featured === true || false,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0
    } as any);

    res.status(201).json({ code: 201, message: 'Case created successfully', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to create case', error: error.message });
  }
});

router.put('/admin/cases/:id', authMiddleware, uploadHandlers.cases.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description, content, industry, company, oldImage, featured, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/cases/${req.file.filename}` : undefined;

    if (imageUrl && oldImage) {
      const oldImagePath = oldImage.startsWith('/uploads/') ? oldImage.substring('/uploads/'.length) : oldImage;
      const fullPath = path.join(uploadDir, oldImagePath);
      
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }
    }

    let finalImageUrl = imageUrl;
    if (!imageUrl) {
      const currentCase = await CaseService.getCaseById(req.params.id);
      finalImageUrl = currentCase?.image || undefined;
    }

    const c = await CaseService.updateCase(req.params.id, {
      title,
      description,
      content,
      image: finalImageUrl,
      industry,
      company,
      featured: featured === 'true' || featured === true || false,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0
    } as any);

    res.json({ code: 200, message: 'Case updated successfully', data: c });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to update case', error: error.message });
  }
});

router.delete('/admin/cases/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const c = await CaseService.getCaseById(req.params.id);
    if (!c) {
      return res.status(404).json({ code: 404, message: 'Case not found' });
    }

    const deletedCase = await CaseService.deleteCase(req.params.id);

    if (c.image) {
      const imagePath = c.image.startsWith('/uploads/') ? c.image.substring('/uploads/'.length) : c.image;
      const fullPath = path.join(uploadDir, imagePath);
      
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.error('Failed to delete image:', e);
        }
      }
    }

    res.json({ code: 200, message: 'Case deleted successfully', data: deletedCase });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to delete case', error: error.message });
  }
});

// ===== 新闻 API =====

router.get('/news', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await NewsService.getNewsList(page, pageSize);
    res.json({
      code: 200,
      message: 'Success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch news', error: error.message });
  }
});

router.get('/news/featured', async (req: Request, res: Response) => {
  try {
    const news = await NewsService.getFeaturedNews();
    res.json({
      code: 200,
      message: 'Success',
      data: news
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch featured news', error: error.message });
  }
});

router.get('/news/:id', async (req: Request, res: Response) => {
  try {
    const news = await NewsService.getNewsById(req.params.id);
    if (!news) return res.status(404).json({ code: 404, message: 'News not found' });
    res.json({ code: 200, message: 'Success', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch news', error: error.message });
  }
});

// Admin 端点：获取新闻列表（需认证）
router.get('/admin/news', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await NewsService.getNewsList(page, pageSize);
    res.json({
      code: 200,
      message: 'Success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch news', error: error.message });
  }
});

// Admin 端点：获取单条新闻（需认证）
router.get('/admin/news/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const news = await NewsService.getNewsById(req.params.id);
    if (!news) return res.status(404).json({ code: 404, message: 'News not found' });
    res.json({ code: 200, message: 'Success', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch news', error: error.message });
  }
});

router.post('/admin/news', authMiddleware, uploadHandlers.news.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, content, category, excerpt, featured, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/news/${req.file.filename}` : null;

    const news = await NewsService.createNews({
      title,
      content,
      excerpt,
      image: imageUrl,
      category,
      featured: featured === 'true' || featured === true || false,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0
    } as any);

    res.status(201).json({ code: 201, message: 'News created successfully', data: news });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to create news', error: error.message });
  }
});

router.put('/admin/news/:id', authMiddleware, uploadHandlers.news.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, content, category, excerpt, oldImage, featured, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/news/${req.file.filename}` : undefined;

    console.log('=== PUT /admin/news/:id ===');
    console.log('News ID:', req.params.id);
    console.log('oldImage from body:', oldImage);
    console.log('newImage:', req.file?.filename);

    // 如果有新图片上传且有旧图片路径，删除旧图片
    if (imageUrl && oldImage) {
      console.log('开始删除旧图片');
      const oldImagePath = oldImage.startsWith('/uploads/') ? oldImage.substring('/uploads/'.length) : oldImage;
      const fullPath = path.join(uploadDir, oldImagePath);
      
      console.log('旧图片路径处理:', { 原始: oldImage, 处理后: oldImagePath, 完整路径: fullPath });
      
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log('✓ 成功删除旧图片:', fullPath);
        } catch (err) {
          console.error('✗ 删除旧图片失败:', err);
        }
      } else {
        console.warn('⚠ 旧图片不存在:', fullPath);
      }
    } else {
      console.log('没有旧图片路径或没有上传新图片，跳过删除');
    }

    // 确定最终图片路径：优先用新上传的图片，否则保持原有图片
    let finalImageUrl = imageUrl;
    if (!imageUrl) {
      const currentNews = await NewsService.getNewsById(req.params.id);
      finalImageUrl = currentNews?.image || undefined;
      console.log('保持原有图片:', finalImageUrl);
    }

    const news = await NewsService.updateNews(req.params.id, {
      title,
      content,
      excerpt,
      image: finalImageUrl,
      category,
      featured: featured === 'true' || featured === true || false,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0
    } as any);

    console.log('✓ 新闻已更新');
    res.json({ code: 200, message: 'News updated successfully', data: news });
  } catch (error: any) {
    console.error('✗ 更新失败:', error);
    res.status(500).json({ code: 500, message: 'Failed to update news', error: error.message });
  }
});

router.delete('/admin/news/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('=== DELETE /admin/news/:id ===');
    console.log('News ID:', req.params.id);
    
    // 先获取新闻信息以获取图片路径
    const news = await NewsService.getNewsById(req.params.id);
    if (!news) {
      console.log('✗ 新闻不存在:', req.params.id);
      return res.status(404).json({ code: 404, message: 'News not found' });
    }

    console.log('新闻信息:', { id: news.id, title: news.title, image: news.image });

    // 删除数据库记录（先删除记录）
    const deletedNews = await NewsService.deleteNews(req.params.id);
    console.log('✓ 已从数据库删除新闻');

    // 删除关联的图片文件
    if (news.image) {
      console.log('要删除的图片:', news.image);
      // 处理路径：如果以/uploads/开头，去掉前缀；否则直接使用
      const imagePath = news.image.startsWith('/uploads/') ? news.image.substring('/uploads/'.length) : news.image;
      const fullPath = path.join(uploadDir, imagePath);
      
      console.log('imagePath处理后:', imagePath);
      console.log('完整路径:', fullPath);
      
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log('✓ 成功删除图片:', fullPath);
        } catch (e) {
          console.error('✗ 删除图片失败:', e);
        }
      } else {
        console.warn('⚠ 图片不存在:', fullPath);
      }
    } else {
      console.log('⚠ 新闻没有关联图片');
    }

    res.json({ code: 200, message: 'News deleted successfully', data: deletedNews });
  } catch (error: any) {
    console.error('✗ 删除失败:', error);
    res.status(500).json({ code: 500, message: 'Failed to delete news', error: error.message });
  }
});

// ===== 文档 API =====
// 文档管理功能已从系统中移除。

// ===== 消息 API =====

router.get('/admin/messages', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await MessageService.getMessagesList(page, pageSize);
    res.json({
      code: 200,
      message: 'Success',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch messages', error: error.message });
  }
});

router.post('/messages', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    const msg = await MessageService.createMessage({
      name,
      email,
      phone: phone || '',
      message,
      status: 'unread'
    } as any);

    res.status(201).json({ code: 201, message: 'Message sent successfully', data: msg });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to send message', error: error.message });
  }
});

router.put('/admin/messages/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const msg = await MessageService.updateMessageStatus(req.params.id, status);
    res.json({ code: 200, message: 'Message status updated', data: msg });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to update message', error: error.message });
  }
});

// 兼容前端调用的路由
router.put('/messages/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const msg = await MessageService.updateMessageStatus(req.params.id, status);
    res.json({ code: 200, message: 'Message status updated', data: msg });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to update message', error: error.message });
  }
});

router.delete('/admin/messages/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const msg = await MessageService.deleteMessage(req.params.id);
    res.json({ code: 200, message: 'Message deleted successfully', data: msg });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to delete message', error: error.message });
  }
});

// ===== 页面内容 API =====

// 获取关于我们页面内容
router.get('/page/about', async (req: Request, res: Response) => {
  try {
    const about = await prisma.pageAbout.findFirst();
    res.json({
      code: 200,
      message: 'Success',
      data: about || { content: '' }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch about page', error: error.message });
  }
});

// Admin 端点：获取关于我们页面（编辑用）
router.get('/admin/page/about', authMiddleware, async (req: Request, res: Response) => {
  try {
    const about = await prisma.pageAbout.findFirst();
    res.json({
      code: 200,
      message: 'Success',
      data: about || { content: '' }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to fetch about page', error: error.message });
  }
});

// Admin 端点：更新关于我们页面
router.put('/admin/page/about', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ code: 400, message: 'Content is required' });
    }

    // 查找现有的记录
    const existing = await prisma.pageAbout.findFirst();

    let result;
    if (existing) {
      result = await prisma.pageAbout.update({
        where: { id: existing.id },
        data: { content, updatedAt: new Date() }
      });
    } else {
      result = await prisma.pageAbout.create({
        data: { content }
      });
    }

    res.json({
      code: 200,
      message: 'About page updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: 'Failed to update about page', error: error.message });
  }
});

export default router;
