// 用户相关
export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// 产品相关
export interface Product {
  id: string;
  name: string;
  model?: string;
  description?: string;
  content?: string;  // Markdown content
  categoryId: string;
  image?: string;
  price?: number;
  featured?: boolean;  // 是否在首页展示
  displayOrder?: number;  // 首页展示顺序
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// 案例相关
export interface Case {
  id: string;
  title: string;
  description: string;
  content?: string;
  image?: string;
  company?: string;  // 客户企业名称
  location?: string;  // 项目地点
  industry?: string;  // 行业分类
  featured?: boolean;  // 是否在首页展示
  displayOrder?: number;  // 首页展示顺序
  createdAt: Date;
  updatedAt: Date;
}

// 新闻相关
export interface News {
  id: string;
  title: string;
  content: string;
  image?: string;
  category?: string;  // 新闻分类
  excerpt?: string;  // 摘要
  author?: string;  // 作者
  date?: string;  // 发布日期
  featured?: boolean;  // 是否在首页展示
  displayOrder?: number;  // 首页展示顺序
  createdAt: Date;
  updatedAt: Date;
}

// 文档相关
export interface Document {
  id: string;
  title: string;
  content: string;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 消息相关
export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// API 响应格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
  error?: string;
}

// 认证相关
export interface AuthPayload {
  username: string;
  password: string;
}

export interface TokenPayload {
  username: string;
  iat?: number;
  exp?: number;
}
