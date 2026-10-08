import { prisma } from '../config/db.js';
import { ApiError } from '../utils/apiResponse.js';

export class ProductService {
  static async getAll(query: {
    category?: string;
    categoryId?: number;
    search?: string;
    featured?: boolean;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 50));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.activeOnly !== false) {
      where.active = true;
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    } else if (query.category && query.category !== 'All') {
      where.category = {
        OR: [
          { slug: query.category },
          { name: { equals: query.category, mode: 'insensitive' } }
        ]
      };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { ingredients: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }]
          }
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit
      })
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }]
        }
      }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  }

  static async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }]
        }
      }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  }

  static async create(data: any) {
    let slug = data.slug;
    if (!slug) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const { images, ...productData } = data;

    const created = await prisma.product.create({
      data: {
        ...productData,
        slug,
        images: images && images.length > 0 ? {
          create: images.map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || data.name,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            order: img.order || idx
          }))
        } : undefined
      },
      include: {
        category: true,
        images: true
      }
    });

    return created;
  }

  static async update(id: number, data: any) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }

    const { images, ...productData } = data;

    return await prisma.$transaction(async (tx) => {
      if (images && Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            url: img.url,
            altText: img.altText || existing.name,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            order: img.order || idx
          }))
        });
      }

      return await tx.product.update({
        where: { id },
        data: productData,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }]
          }
        }
      });
    });
  }

  static async delete(id: number) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }

    await prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}
