import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export const getTableByNumber = async (req: Request, res: Response): Promise<void> => {
  const number = parseInt(req.params.number, 10);

  if (isNaN(number)) {
    throw new AppError('Invalid table number', 400);
  }

  const table = await prisma.table.findUnique({
    where: { number },
    select: { id: true, number: true, label: true, isActive: true },
  });

  if (!table || !table.isActive) {
    throw new AppError(`Table ${number} not found or inactive`, 404);
  }

  res.json({ success: true, data: table });
};
