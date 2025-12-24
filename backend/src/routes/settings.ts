import { Router, Request, Response } from 'express';
import { SiteInfoService, SiteMetaService } from '../services/SiteInfoService.js';
import { authMiddleware } from '../middleware/index.js';

const router = Router();

// ===== 网站设置 - 公开接口 =====

/**
 * 获取网站信息（公开）
 * GET /api/settings/info
 */
router.get('/info', async (req: Request, res: Response) => {
  try {
    const siteInfo = await SiteInfoService.getSiteInfo();
    res.json({
      code: 200,
      message: 'Success',
      data: siteInfo
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch site info',
      error: error.message
    });
  }
});

/**
 * 获取联系方式（公开）
 * GET /api/settings/contact
 */
router.get('/contact', async (req: Request, res: Response) => {
  try {
    const contactInfo = await SiteInfoService.getContactInfo();
    res.json({
      code: 200,
      message: 'Success',
      data: contactInfo
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch contact info',
      error: error.message
    });
  }
});

/**
 * 获取社交媒体（公开）
 * GET /api/settings/social
 */
router.get('/social', async (req: Request, res: Response) => {
  try {
    const socialMedia = await SiteInfoService.getSocialMedia();
    res.json({
      code: 200,
      message: 'Success',
      data: socialMedia
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch social media info',
      error: error.message
    });
  }
});

/**
 * 获取公司信息（公开）
 * GET /api/settings/company
 */
router.get('/company', async (req: Request, res: Response) => {
  try {
    const companyInfo = await SiteInfoService.getCompanyInfo();
    res.json({
      code: 200,
      message: 'Success',
      data: companyInfo
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch company info',
      error: error.message
    });
  }
});

/**
 * 获取网站元数据（公开）
 * GET /api/settings/meta
 */
router.get('/meta', async (req: Request, res: Response) => {
  try {
    const siteMeta = await SiteMetaService.getSiteMeta();
    res.json({
      code: 200,
      message: 'Success',
      data: siteMeta
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch site meta',
      error: error.message
    });
  }
});

// ===== 网站设置 - 管理后台 =====

/**
 * 获取网站信息（后台）
 * GET /api/admin/settings/info
 */
router.get('/admin/info', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('📋 获取网站信息（后台）');
    const siteInfo = await SiteInfoService.getSiteInfo();
    console.log('✅ 网站信息:', siteInfo);
    res.json({
      code: 200,
      message: 'Success',
      data: siteInfo
    });
  } catch (error: any) {
    console.error('❌ 获取网站信息失败:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch site info',
      error: error.message
    });
  }
});

/**
 * 更新网站信息
 * PUT /api/admin/settings/info
 */
router.put('/admin/info', authMiddleware, async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    
    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({
        code: 400,
        message: 'Invalid request body'
      });
    }

    const updatedInfo = await SiteInfoService.updateSiteInfo(updateData);
    
    res.json({
      code: 200,
      message: 'Site info updated successfully',
      data: updatedInfo
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to update site info',
      error: error.message
    });
  }
});

/**
 * 获取网站元数据（后台）
 * GET /api/admin/settings/meta
 */
router.get('/admin/meta', authMiddleware, async (req: Request, res: Response) => {
  try {
    const siteMeta = await SiteMetaService.getSiteMeta();
    res.json({
      code: 200,
      message: 'Success',
      data: siteMeta
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to fetch site meta',
      error: error.message
    });
  }
});

/**
 * 更新网站元数据
 * PUT /api/admin/settings/meta
 */
router.put('/admin/meta', authMiddleware, async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    
    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({
        code: 400,
        message: 'Invalid request body'
      });
    }

    const updatedMeta = await SiteMetaService.updateSiteMeta(updateData);
    
    res.json({
      code: 200,
      message: 'Site meta updated successfully',
      data: updatedMeta
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to update site meta',
      error: error.message
    });
  }
});

export default router;
