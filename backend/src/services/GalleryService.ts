import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GalleryService = {
  async createGallery(data: { title: string; image: string }) {
    return await prisma.gallery.create({
      data,
    });
  },

  async getGalleries(page: number = 1, pageSize: number = 12) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.gallery.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gallery.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  },

  async getGalleryById(id: string) {
    return await prisma.gallery.findUnique({
      where: { id },
    });
  },

  async updateGallery(id: string, data: { title?: string; image?: string }) {
    return await prisma.gallery.update({
      where: { id },
      data,
    });
  },

  async deleteGallery(id: string) {
    return await prisma.gallery.delete({
      where: { id },
    });
  },
};
