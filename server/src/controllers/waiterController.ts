import { Request, Response } from 'express';
import { Server } from 'socket.io';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

const VALID_REQUEST_TYPES = ['WATER', 'BILL', 'WAITER', 'TISSUE'] as const;
type RequestType = typeof VALID_REQUEST_TYPES[number];

export const callWaiter = async (req: Request, res: Response): Promise<void> => {
  const { tableNumber, requestType } = req.body;

  if (!tableNumber || !requestType) {
    throw new AppError('tableNumber and requestType are required', 400);
  }

  const normalizedType = (requestType as string).toUpperCase() as RequestType;
  if (!VALID_REQUEST_TYPES.includes(normalizedType)) {
    throw new AppError(`Invalid requestType. Must be one of: ${VALID_REQUEST_TYPES.join(', ')}`, 400);
  }

  const table = await prisma.table.findUnique({ where: { number: tableNumber } });
  if (!table) {
    throw new AppError(`Table ${tableNumber} not found`, 404);
  }

  const waiterRequest = await prisma.waiterRequest.create({
    data: {
      tableId: table.id,
      requestType: normalizedType,
      status: 'PENDING',
    },
    include: {
      table: { select: { number: true, label: true } },
    },
  });

  // Emit to kitchen/staff dashboard
  const io: Server = req.app.get('io');
  if (io) {
    io.emit('waiter:request', {
      id: waiterRequest.id,
      tableNumber: waiterRequest.table.number,
      requestType: waiterRequest.requestType,
      createdAt: waiterRequest.createdAt,
    });
  }

  res.status(201).json({ success: true, data: waiterRequest });
};
