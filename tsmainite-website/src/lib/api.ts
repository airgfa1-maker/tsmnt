// API 服务层 - 统一管理所有后端API调用

// 获取 API 基础 URL
// 在客户端使用相对路径 /api，Next.js 会代理到后端
// 在服务端使用环境变量配置的完整 URL（如果需要）
const getApiBaseUrl = () => {
  // 如果有明确的环境变量，使用它
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // 如果在浏览器环境，使用相对路径
  if (typeof window !== 'undefined') {
    return '/api';
  }
  
  // 服务端默认使用相对路径，也可以配置为完整 URL
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// =============== 新闻相关API ===============

export interface NewsItem {
  id: string;  // 改为字符串
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
}

export interface NewsResponse {
  code: number;
  message: string;
  data: NewsItem[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface NewsDetailResponse {
  code: number;
  message: string;
  data: NewsItem;
}

/**
 * 获取新闻列表
 * @param page - 页码，默认1
 * @param pageSize - 每页条数，默认6
 * @returns 新闻列表数据
 */
export async function getNewsList(page: number = 1, pageSize: number = 6): Promise<NewsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news?page=${page}&pageSize=${pageSize}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch news list:', error);
    throw error;
  }
}

/**
 * 获取首页展示的新闻（仅显示featured=true的新闻，按displayOrder排序）
 * @returns 特色新闻列表
 */
export async function getFeaturedNews(): Promise<NewsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/featured`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch featured news:', error);
    throw error;
  }
}

/**
 * 获取新闻详情
 * @param id - 新闻ID
 * @returns 新闻详情数据（包含markdown内容）
 */
export async function getNewsDetail(id: string): Promise<NewsDetailResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/${id}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch news detail (id: ${id}):`, error);
    throw error;
  }
}

// =============== 案例相关API ===============

export interface Case {
  id: string;  // 改为字符串
  industry: string;
  industryName: string;
  title: string;
  excerpt: string;
  image: string;
  company?: string;
  location?: string;
  description?: string;
  content?: string;
  metrics?: string;
}

export interface CaseCategory {
  id: string;
  name: string;
  count: number;
}

export interface CaseListResponse {
  code: number;
  message: string;
  data: Case[];
  categories: CaseCategory[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CaseDetailResponse {
  code: number;
  message: string;
  data: Case;
}

/**
 * 获取案例列表
 * @param industry - 行业过滤，为'all'表示所有
 * @param page - 页码
 * @param pageSize - 每页条数
 * @returns 案例列表
 */
export async function getCaseList(
  industry: string = 'all',
  page: number = 1,
  pageSize: number = 6
): Promise<CaseListResponse> {
  try {
    const query = new URLSearchParams();
    if (industry !== 'all') query.append('industry', industry);
    query.append('page', page.toString());
    query.append('pageSize', pageSize.toString());
    
    const response = await fetch(
      `${API_BASE_URL}/cases?${query.toString()}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cases list:', error);
    throw error;
  }
}

/**
 * 获取首页展示的案例（仅显示featured=true的案例，按displayOrder排序）
 * @returns 特色案例列表
 */
export async function getFeaturedCases(): Promise<CaseListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cases/featured`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch featured cases:', error);
    throw error;
  }
}

/**
 * 获取案例详情
 * @param id - 案例ID
 * @returns 案例详情数据
 */
export async function getCaseDetail(id: string): Promise<CaseDetailResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cases/${id}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch case detail (id: ${id}):`, error);
    throw error;
  }
}

// =============== 产品相关API ===============

export interface Product {
  id: number;
  categoryId: string;
  name: string;
  model?: string;
  content?: string;
  description: string;
  applications: string[];
  customers: number;
  image: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  count: number;
}

export interface ProductListResponse {
  code: number;
  message: string;
  data: Product[];
  categories: ProductCategory[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  code: number;
  message: string;
  data: Product;
}

/**
 * 获取产品列表（支持分类过滤）
 * @param categoryId - 产品分类ID（可选，为空时获取所有产品）
 * @param page - 页码
 * @param pageSize - 每页条数
 * @returns 产品列表
 */
export async function getProductList(
  categoryId: string = '',
  page: number = 1,
  pageSize: number = 12
): Promise<ProductListResponse> {
  try {
    const query = new URLSearchParams();
    if (categoryId) query.append('categoryId', categoryId);
    query.append('page', page.toString());
    query.append('pageSize', pageSize.toString());
    
    const response = await fetch(
      `${API_BASE_URL}/products?${query.toString()}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch product list:', error);
    throw error;
  }
}

/**
 * 获取首页展示的产品（最多5个，按displayOrder排序）
 * @returns 特色产品列表
 */
export async function getFeaturedProducts(): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/featured`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    throw error;
  }
}

/**
 * 获取产品详情
 * @param id - 产品ID
 * @returns 产品详情数据
 */
export async function getProductDetail(id: number): Promise<ProductDetailResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${id}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product detail (id: ${id}):`, error);
    throw error;
  }
}

/**
 * 获取产品类别列表（用于动态导航）
 * @returns 产品类别数据
 */
export async function getProductCategories(): Promise<{ code: number; data: ProductCategory[] }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product-categories`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch product categories:', error);
    throw error;
  }
}

// =============== 支持文档API ===============

export interface Document {
  id: number;
  categoryId: string;
  title: string;
  description: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
  releaseDate: string;
  version: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  count: number;
}

export interface DocumentListResponse {
  code: number;
  message: string;
  data: Document[];
  categories: DocumentCategory[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 获取支持文档列表
 * @param categoryId - 文档分类ID（可选）
 * @param page - 页码
 * @param pageSize - 每页条数
 * @returns 文档列表
 */
export async function getDocumentList(
  categoryId: string = '',
  page: number = 1,
  pageSize: number = 20
): Promise<DocumentListResponse> {
  try {
    const query = new URLSearchParams();
    if (categoryId) query.append('categoryId', categoryId);
    query.append('page', page.toString());
    query.append('pageSize', pageSize.toString());
    
    const response = await fetch(
      `${API_BASE_URL}/documents?${query.toString()}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch documents list:', error);
    throw error;
  }
}

/**
 * 获取文档分类列表
 * @returns 文档分类数据
 */
export async function getDocumentCategories(): Promise<{ code: number; data: DocumentCategory[] }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/documents/categories`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch document categories:', error);
    throw error;
  }
}

// =============== 联系表单API ===============



export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  code: number;
  message: string;
}

// =============== 首页管理相关API ===============

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 获取Hero轮播幻灯片
 * @returns Hero幻灯片列表
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home/hero-slides`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch hero slides:', error);
    throw error;
  }
}

export interface HomeAbout {
  id: string;
  title: string;
  content: string;
  image?: string;
  updatedAt?: string;
}

/**
 * 获取首页About部分
 */
export async function getHomeAbout(): Promise<HomeAbout> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home/about`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch home about:', error);
    throw error;
  }
}

export interface HomeProductCard {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 获取首页产品卡片
 */
export async function getHomeProductCards(): Promise<HomeProductCard[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home/product-cards`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch home product cards:', error);
    throw error;
  }
}
