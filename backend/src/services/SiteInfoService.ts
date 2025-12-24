import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 网站信息设置服务
 * 管理全局网站配置、联系方式、社交媒体等
 */
export class SiteInfoService {
  /**
   * 获取网站信息
   */
  static async getSiteInfo() {
    let siteInfo = await prisma.siteInfo.findFirst();
    
    // 如果不存在，创建默认的网站信息
    if (!siteInfo) {
      siteInfo = await prisma.siteInfo.create({
        data: {
          phone: '139-3150-1373',
          whatsapp: '1393150137',
          email: 'tsmainite@163.com',
          address: '河北省唐山市',
          companyName: '唐山迈尼特电气有限公司',
          companyDescription: '专业磁电解决方案提供商，20年深耕工业电磁技术领域。',
          icp: 'ICP备案',
          securityCode: '公安备案号',
          theme: 'light',
          language: 'zh-CN'
        } as any
      });
    }
    
    return siteInfo;
  }

  /**
   * 更新网站信息
   */
  static async updateSiteInfo(data: Partial<any>): Promise<any> {
    let siteInfo = await prisma.siteInfo.findFirst();
    
    // 如果不存在，先创建
    if (!siteInfo) {
      return await this.getSiteInfo().then(() => this.updateSiteInfo(data));
    }

    const updateData: any = {};
    
    // 联系方式
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.address !== undefined) updateData.address = data.address;
    
    // 公司信息
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.companyDescription !== undefined) updateData.companyDescription = data.companyDescription;
    if (data.companyLogo !== undefined) updateData.companyLogo = data.companyLogo;
    
    // 社交媒体
    if (data.facebook !== undefined) updateData.facebook = data.facebook;
    if (data.instagram !== undefined) updateData.instagram = data.instagram;
    if (data.twitter !== undefined) updateData.twitter = data.twitter;
    if (data.youtube !== undefined) updateData.youtube = data.youtube;
    if (data.tiktok !== undefined) updateData.tiktok = data.tiktok;
    if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
    
    // 备案信息
    if (data.icp !== undefined) updateData.icp = data.icp;
    if (data.securityCode !== undefined) updateData.securityCode = data.securityCode;
    
    // 百度地图设置
    if (data.baiduMapAk !== undefined) updateData.baiduMapAk = data.baiduMapAk;
    if (data.officeAddressName !== undefined) updateData.officeAddressName = data.officeAddressName;
    if (data.officeAddressDetail !== undefined) updateData.officeAddressDetail = data.officeAddressDetail;
    if (data.officeAddressLng !== undefined) updateData.officeAddressLng = data.officeAddressLng;
    if (data.officeAddressLat !== undefined) updateData.officeAddressLat = data.officeAddressLat;
    if (data.officePhone !== undefined) updateData.officePhone = data.officePhone;
    if (data.officeEmail !== undefined) updateData.officeEmail = data.officeEmail;
    
    // 其他设置
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.language !== undefined) updateData.language = data.language;

    return await prisma.siteInfo.update({
      where: { id: siteInfo.id },
      data: updateData
    });
  }

  /**
   * 批量更新网站信息
   */
  static async batchUpdateSiteInfo(updates: Record<string, any>) {
    return await this.updateSiteInfo(updates);
  }

  /**
   * 获取网站联系方式
   */
  static async getContactInfo() {
    const siteInfo = await this.getSiteInfo();
    return {
      phone: siteInfo.phone,
      whatsapp: siteInfo.whatsapp,
      email: siteInfo.email,
      address: siteInfo.address
    };
  }

  /**
   * 获取社交媒体链接
   */
  static async getSocialMedia() {
    const siteInfo = await this.getSiteInfo();
    return {
      facebook: siteInfo.facebook,
      instagram: siteInfo.instagram,
      twitter: siteInfo.twitter,
      youtube: siteInfo.youtube,
      tiktok: siteInfo.tiktok,
      linkedin: siteInfo.linkedin
    };
  }

  /**
   * 获取公司信息
   */
  static async getCompanyInfo() {
    const siteInfo = await this.getSiteInfo();
    return {
      companyName: siteInfo.companyName,
      companyDescription: siteInfo.companyDescription,
      companyLogo: siteInfo.companyLogo,
      phone: siteInfo.phone,
      email: siteInfo.email,
      address: siteInfo.address
    };
  }
}

/**
 * SEO 和元数据服务
 */
export class SiteMetaService {
  /**
   * 获取网站元数据
   */
  static async getSiteMeta() {
    let siteMeta = await prisma.siteMeta.findFirst();
    
    // 如果不存在，创建默认的元数据
    if (!siteMeta) {
      siteMeta = await prisma.siteMeta.create({
        data: {
          title: '唐山迈尼特电气有限公司',
          description: '专业磁电解决方案提供商，20年深耕工业电磁技术领域。',
          keywords: '磁电,电气,解决方案',
          author: 'TS Mainite'
        }
      });
    }
    
    return siteMeta;
  }

  /**
   * 更新网站元数据
   */
  static async updateSiteMeta(data: Partial<any>): Promise<any> {
    let siteMeta = await prisma.siteMeta.findFirst();
    
    // 如果不存在，先创建
    if (!siteMeta) {
      return await this.getSiteMeta().then(() => this.updateSiteMeta(data));
    }

    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.keywords !== undefined) updateData.keywords = data.keywords;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.favicon !== undefined) updateData.favicon = data.favicon;
    if (data.ogImage !== undefined) updateData.ogImage = data.ogImage;

    return await prisma.siteMeta.update({
      where: { id: siteMeta.id },
      data: updateData
    });
  }
}
