// Admin 管理系统类型定义

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationResult;
}

// 内容类型通用接口
export interface ContentItem {
  id: string | number;
  title: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 具体内容类型
export interface News extends ContentItem {
  title: string;
  category: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export interface Case extends ContentItem {
  title: string;
  industry: string;
  company?: string;
  content: string;
  imageUrl?: string;
}

export interface Product extends ContentItem {
  name: string;
  model: string;
  categoryId: string;
  description: string;
  specs?: string;
  imageUrl?: string;
}

export interface ProductCategory {
  id: string | number;
  name: string;
  description?: string;
}

export interface Document extends ContentItem {
  title: string;
  category: string;
  content: string;
  fileUrl?: string;
}

export interface Message {
  id: string | number;
  name: string;
  email: string;
  content: string;
  status: 'unread' | 'read' | 'replied';
  createdAt?: string;
}

export interface SpecsTranslation {
  id: string | number;
  fieldName: string;
  language: string;
  translation: string;
}

// 表单字段配置
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'checkbox' | 'file' | 'image';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  multiline?: boolean;
  rows?: number;
}

// 表格列配置
export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'badge' | 'action';
  width?: string;
  render?: (value: any, item: any) => React.ReactNode;
}

// 管理列表页面配置
export interface ListPageConfig {
  title: string;
  icon: string;
  endpoint: string;
  createPath: string;
  editPath: (id: string | number) => string;
  columns: TableColumn[];
}
