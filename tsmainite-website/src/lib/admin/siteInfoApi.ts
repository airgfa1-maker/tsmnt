/**
 * 网站设置 API 客户端
 * 用于前端后台管理系统调用网站信息设置接口
 */

interface SiteInfo {
  id: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  companyName?: string;
  companyDescription?: string;
  companyLogo?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  icp?: string;
  securityCode?: string;
  baiduMapAk?: string;
  officeAddressName?: string;
  officeAddressDetail?: string;
  officeAddressLng?: number;
  officeAddressLat?: number;
  officePhone?: string;
  officeEmail?: string;
  theme: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface SiteMeta {
  id: string;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  favicon?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

interface CompanyInfo {
  companyName?: string;
  companyDescription?: string;
  companyLogo?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 网站信息 API 客户端
 */
export class SiteInfoApi {
  private static baseURL = '/api';
  private static token: string | null = null;

  /**
   * 设置认证令牌
   */
  static setToken(token: string) {
    this.token = token;
  }

  /**
   * 获取请求头
   */
  private static getHeaders(includeAuth = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // ===== 公开接口 =====

  /**
   * 获取网站信息
   */
  static async getSiteInfo(): Promise<SiteInfo> {
    const response = await fetch(`${this.baseURL}/settings/info`);
    const data: ApiResponse<SiteInfo> = await response.json();
    return data.data;
  }

  /**
   * 获取联系方式
   */
  static async getContactInfo(): Promise<ContactInfo> {
    const response = await fetch(`${this.baseURL}/settings/contact`);
    const data: ApiResponse<ContactInfo> = await response.json();
    return data.data;
  }

  /**
   * 获取社交媒体信息
   */
  static async getSocialMedia(): Promise<SocialMedia> {
    const response = await fetch(`${this.baseURL}/settings/social`);
    const data: ApiResponse<SocialMedia> = await response.json();
    return data.data;
  }

  /**
   * 获取公司信息
   */
  static async getCompanyInfo(): Promise<CompanyInfo> {
    const response = await fetch(`${this.baseURL}/settings/company`);
    const data: ApiResponse<CompanyInfo> = await response.json();
    return data.data;
  }

  /**
   * 获取网站元数据（SEO）
   */
  static async getSiteMeta(): Promise<SiteMeta> {
    const response = await fetch(`${this.baseURL}/settings/meta`);
    const data: ApiResponse<SiteMeta> = await response.json();
    return data.data;
  }

  // ===== 管理后台接口 =====

  /**
   * 获取网站信息（后台）
   */
  static async getAdminSiteInfo(): Promise<SiteInfo> {
    const response = await fetch(`${this.baseURL}/settings/admin/info`, {
      headers: this.getHeaders(true)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site info: ${response.statusText}`);
    }

    const data: ApiResponse<SiteInfo> = await response.json();
    return data.data;
  }

  /**
   * 更新网站信息
   */
  static async updateSiteInfo(updates: Partial<SiteInfo>): Promise<SiteInfo> {
    const response = await fetch(`${this.baseURL}/settings/admin/info`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update site info: ${response.statusText}`);
    }

    const data: ApiResponse<SiteInfo> = await response.json();
    return data.data;
  }

  /**
   * 批量更新网站信息
   */
  static async batchUpdateSiteInfo(updates: Partial<SiteInfo>): Promise<SiteInfo> {
    const response = await fetch(`${this.baseURL}/admin/site-info`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to batch update site info: ${response.statusText}`);
    }

    const data: ApiResponse<SiteInfo> = await response.json();
    return data.data;
  }

  /**
   * 更新联系方式
   */
  static async updateContactInfo(contact: Partial<ContactInfo>): Promise<SiteInfo> {
    return this.updateSiteInfo(contact);
  }

  /**
   * 更新社交媒体信息
   */
  static async updateSocialMedia(social: Partial<SocialMedia>): Promise<SiteInfo> {
    return this.updateSiteInfo(social);
  }

  /**
   * 获取网站元数据（后台）
   */
  static async getAdminSiteMeta(): Promise<SiteMeta> {
    const response = await fetch(`${this.baseURL}/settings/admin/meta`, {
      headers: this.getHeaders(true)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site meta: ${response.statusText}`);
    }

    const data: ApiResponse<SiteMeta> = await response.json();
    return data.data;
  }

  /**
   * 更新网站元数据
   */
  static async updateSiteMeta(updates: Partial<SiteMeta>): Promise<SiteMeta> {
    const response = await fetch(`${this.baseURL}/settings/admin/meta`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update site meta: ${response.statusText}`);
    }

    const data: ApiResponse<SiteMeta> = await response.json();
    return data.data;
  }
}

export type { SiteInfo, SiteMeta, ContactInfo, SocialMedia, CompanyInfo, ApiResponse };
