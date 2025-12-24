import { PrismaClient } from '@prisma/client';
import { Case, News, Document, Message } from '../types';

const prisma = new PrismaClient();

/**
 * 案例服务
 */
export class CaseService {
  static async getAllCases() {
    return prisma.case.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async getCasesList(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.case.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.case.count()
    ]);
    return { data, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  static async getFeaturedCases() {
    return prisma.case.findMany({
      where: { featured: true },
      orderBy: { displayOrder: 'asc' },
      take: 5
    });
  }

  static async getCaseById(id: string) {
    return prisma.case.findUnique({ where: { id } });
  }

  static async createCase(data: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.case.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content || '',
        image: data.image || null,
        industry: data.industry || null,
        company: data.company || null,
        featured: data.featured || false,
        displayOrder: data.displayOrder || 0
      }
    });
  }

  static async updateCase(id: string, data: Partial<Case>) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.industry !== undefined) updateData.industry = data.industry;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    
    return prisma.case.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteCase(id: string) {
    return prisma.case.delete({ where: { id } });
  }
}

/**
 * 新闻服务
 */
export class NewsService {
  static async getAllNews() {
    return prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async getNewsList(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.news.count()
    ]);
    return { data, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  static async getFeaturedNews() {
    return prisma.news.findMany({
      where: { featured: true },
      orderBy: { displayOrder: 'asc' },
      take: 5
    });
  }

  static async getNewsById(id: string) {
    return prisma.news.findUnique({ where: { id } });
  }

  static async createNews(data: any) {
    return prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image || null,
        category: data.category || null,
        date: data.date || null,
        excerpt: data.excerpt || null,
        author: data.author || null,
        featured: data.featured || false,
        displayOrder: data.displayOrder || 0
      }
    });
  }

  static async updateNews(id: string, data: Partial<News>) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    
    return prisma.news.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteNews(id: string) {
    return prisma.news.delete({ where: { id } });
  }
}

/**
 * 文档服务
 */
export class DocumentService {
  static async getAllDocuments() {
    return prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async getDocumentsList(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.document.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.document.count()
    ]);
    return { data, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  static async getDocumentById(id: string) {
    return prisma.document.findUnique({ where: { id } });
  }

  static async createDocument(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.document.create({
      data: {
        title: data.title,
        content: data.content,
        file: data.file || null
      }
    });
  }

  static async updateDocument(id: string, data: Partial<Document>) {
    return prisma.document.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        // 如果提供了 file（包括null），更新它；否则保持不变
        ...(data.file !== undefined && { file: data.file })
      }
    });
  }

  static async deleteDocument(id: string) {
    return prisma.document.delete({ where: { id } });
  }
}

/**
 * 消息服务
 */
export class MessageService {
  static async getAllMessages() {
    return prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async getMessagesList(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.message.count()
    ]);
    return { data, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  static async getMessageById(id: string) {
    return prisma.message.findUnique({ where: { id } });
  }

  static async createMessage(data: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        status: 'unread'
      }
    });
  }

  static async updateMessageStatus(id: string, status: string) {
    return prisma.message.update({
      where: { id },
      data: { status }
    });
  }

  static async deleteMessage(id: string) {
    return prisma.message.delete({ where: { id } });
  }
}


