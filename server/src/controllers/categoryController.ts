import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { products: { where: { isAvailable: true } } },
      },
    },
  });

  res.json({
    success: true,
    data: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      productCount: cat._count.products,
    })),
  });
};
