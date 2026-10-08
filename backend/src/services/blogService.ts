import { prisma } from '../config/db.js';
import { ApiError } from '../utils/apiResponse.js';

export class BlogService {
  static async getAll(publishedOnly: boolean = true) {
    const where = publishedOnly ? { published: true } : {};
    return await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug }
    });

    if (!blog) {
      throw new ApiError(404, 'Blog post not found');
    }

    return blog;
  }

  static async getById(id: number) {
    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      throw new ApiError(404, 'Blog post not found');
    }

    return blog;
  }

  static async create(data: any) {
    let slug = data.slug;
    if (!slug) {
      slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return await prisma.blog.create({
      data: {
        ...data,
        slug
      }
    });
  }

  static async update(id: number, data: any) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Blog post not found');
    }

    return await prisma.blog.update({
      where: { id },
      data
    });
  }

  static async delete(id: number) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Blog post not found');
    }

    await prisma.blog.delete({ where: { id } });
    return { message: 'Blog post deleted successfully' };
  }
}
