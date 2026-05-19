import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const { categoryId, search } = req.query;

  const where: any = { isAvailable: true };

  if (categoryId) {
    where.categoryId = categoryId as string;
  }

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json({ success: true, data: products });
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  res.json({ success: true, data: product });
};
