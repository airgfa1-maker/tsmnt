import { PrismaClient } from '@prisma/client';
import { Product, ProductCategory } from '../types';

const prisma = new PrismaClient();

/**
 * 产品服务
 */
export class ProductService {
  /**
   * 获取所有产品（无分页）
   */
  static async getAllProducts() {
    return prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 获取产品列表（带分页和分类过滤）
   */
  static async getProductsList(page: number = 1, pageSize: number = 10, categoryId?: string) {
    const skip = (page - 1) * pageSize;
    const where = categoryId ? { categoryId } : {};
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.product.count({ where })
    ]);
    return { data, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  /**
   * 获取首页展示的产品（最多5个，按displayOrder排序）
   */
  static async getFeaturedProducts() {
    return prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      orderBy: { displayOrder: 'asc' },
      take: 5
    });
  }

  /**
   * 获取单个产品
   */
  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  /**
   * 创建产品
   */
  static async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { categoryId: string; image?: string; model?: string; content?: string; featured?: boolean; displayOrder?: number }) {
    return prisma.product.create({
      data: {
        name: data.name,
        model: data.model || null,
        description: data.description || null,
        content: data.content || null,
        categoryId: data.categoryId,
        price: data.price || null,
        image: data.image || null,
        featured: data.featured || false,
        displayOrder: data.displayOrder || 0
      },
      include: { category: true }
    });
  }

  /**
   * 更新产品
   */
  static async updateProduct(id: string, data: Partial<Product> & { image?: string; content?: string; featured?: boolean; displayOrder?: number }) {
    return prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.model !== undefined && { model: data.model || null }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.content !== undefined && { content: data.content || null }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.price !== undefined && { price: data.price || null }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder })
      },
      include: { category: true }
    });
  }

  /**
   * 删除产品
   */
  static async deleteProduct(id: string) {
    try {
      // 先尝试删除产品
      const deleted = await prisma.product.delete({
        where: { id }
      });
      return deleted;
    } catch (error: any) {
      // 如果删除失败，尝试理解原因并提供更好的错误信息
      console.error('Failed to delete product:', error);
      
      // 检查产品是否存在
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new Error('产品不存在');
      }
      
      // 其他错误
      throw new Error(`删除产品失败: ${error.message}`);
    }
  }
}

/**
 * 产品分类服务
 */
export class ProductCategoryService {
  /**
   * 获取所有分类
   */
  static async getAllCategories() {
    return prisma.productCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 获取单个分类
   */
  static async getCategoryById(id: string) {
    return prisma.productCategory.findUnique({
      where: { id },
      include: { products: true }
    });
  }

  /**
   * 创建分类
   */
  static async createCategory(name: string) {
    return prisma.productCategory.create({
      data: { name }
    });
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: string, name: string) {
    return prisma.productCategory.update({
      where: { id },
      data: { name }
    });
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: string) {
    // 这个方法会在Prisma级联删除对应的产品
    return prisma.productCategory.delete({
      where: { id }
    });
  }
}
