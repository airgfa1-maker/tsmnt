import { Router, Request, Response } from 'express';
import { SiteInfoService } from '../services/SiteInfoService.js';

const router = Router();

/**
 * 百度地图API配置路由
 * 获取百度地图配置和API密钥
 */

/**
 * GET /api/map/config
 * 获取百度地图配置
 * 
 * 返回:
 * {
 *   code: 200,
 *   data: {
 *     ak: string,
 *     defaultLocation: { name, lng, lat }
 *   }
 * }
 */
router.get('/config', async (req: Request, res: Response) => {
  try {
    const siteInfo = await SiteInfoService.getSiteInfo();
    const mapConfig = {
      ak: (siteInfo as any).baiduMapAk || process.env.BAIDU_MAP_AK || 'YOUR_BAIDU_MAP_AK_HERE',
      defaultLocation: {
        name: (siteInfo as any).officeAddressName || '公司办公室',
        lng: (siteInfo as any).officeAddressLng || 116.4074,
        lat: (siteInfo as any).officeAddressLat || 39.9042,
      }
    };
    
    res.json({
      code: 200,
      message: 'Map config retrieved successfully',
      data: mapConfig
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to get map config',
      error: error.message
    });
  }
});

/**
 * GET /api/map/locations
 * 获取办公地址位置（单个地址）
 */
router.get('/locations', async (req: Request, res: Response) => {
  try {
    const siteInfo = await SiteInfoService.getSiteInfo();
    
    const locations = [];
    if ((siteInfo as any).officeAddressName) {
      locations.push({
        id: 1,
        name: (siteInfo as any).officeAddressName,
        address: (siteInfo as any).officeAddressDetail || siteInfo.address || '地址未配置',
        lng: (siteInfo as any).officeAddressLng || 116.4074,
        lat: (siteInfo as any).officeAddressLat || 39.9042,
        phone: (siteInfo as any).officePhone || siteInfo.phone || '',
        email: (siteInfo as any).officeEmail || siteInfo.email || ''
      });
    }

    res.json({
      code: 200,
      message: 'Locations retrieved successfully',
      data: locations
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      message: 'Failed to get locations',
      error: error.message
    });
  }
});

export default router;
