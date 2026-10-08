import { prisma } from '../config/db.js';
import { ApiError } from '../utils/apiResponse.js';

export class CategoryService {
  static async getAll(activeOnly: boolean = false) {
    const where = activeOnly ? { active: true } : {};
    return await prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  static async getById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { active: true },
          include: { images: true }
        }
      }
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    return category;
  }

  static async create(data: any) {
    let slug = data.slug;
    if (!slug) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return await prisma.category.create({
      data: {
        ...data,
        slug
      }
    });
  }

  static async update(id: number, data: any) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Category not found');
    }

    return await prisma.category.update({
      where: { id },
      data
    });
  }

  static async delete(id: number) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Category not found');
    }

    await prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
