import { Request, Response } from 'express';
import { Server } from 'socket.io';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { tableNumber, items, notes } = req.body;

  if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
    throw new AppError('tableNumber and items are required', 400);
  }

  // Find the table by number
  const table = await prisma.table.findUnique({ where: { number: tableNumber } });
  if (!table) {
    throw new AppError(`Table ${tableNumber} not found`, 404);
  }

  // Validate and fetch products to compute prices server-side
  const productIds = items.map((item: any) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isAvailable: true },
  });

  if (products.length !== productIds.length) {
    throw new AppError('One or more products are unavailable', 400);
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Compute total server-side (trusted)
  let total = 0;
  const orderItemsData = items.map((item: any) => {
    const product = productMap.get(item.productId)!;
    const unitPrice = product.price;

    // Add addon prices
    const selectedAddons: string[] = item.addons || [];
    const productAddons = product.addons as any[];
    const addonTotal = selectedAddons.reduce((sum, addonName) => {
      const addon = productAddons.find((a: any) => a.name === addonName);
      return sum + (addon?.price || 0);
    }, 0);

    const lineTotal = (unitPrice + addonTotal) * item.quantity;
    total += lineTotal;

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      sugarLevel: item.sugarLevel || null,
      spiceLevel: item.spiceLevel || null,
      addons: selectedAddons,
    };
  });

  const order = await prisma.order.create({
    data: {
      tableId: table.id,
      total,
      notes: notes || null,
      estimatedTime: 15,
      orderItems: {
        create: orderItemsData,
      },
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: { id: true, name: true, image: true, price: true },
          },
        },
      },
      table: { select: { number: true, label: true } },
    },
  });

  // Emit socket event to kitchen/admin
  const io: Server = req.app.get('io');
  if (io) {
    io.emit('order:new', {
      orderId: order.id,
      tableNumber: order.table.number,
      total: order.total,
      itemCount: order.orderItems.length,
      createdAt: order.createdAt,
    });
  }

  res.status(201).json({ success: true, data: order });
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: {
            select: { id: true, name: true, image: true, price: true },
          },
        },
      },
      table: { select: { number: true, label: true } },
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, estimatedTime } = req.body;

  const validStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED'];
  if (!status || !validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status,
      ...(estimatedTime !== undefined && { estimatedTime }),
    },
    include: {
      table: { select: { number: true } },
    },
  });

  // Emit real-time update to clients watching this order
  const io: Server = req.app.get('io');
  if (io) {
    io.to(`order:${id}`).emit('order:updated', {
      orderId: id,
      status: order.status,
      estimatedTime: order.estimatedTime,
    });

    // Also broadcast to kitchen
    io.emit('order:statusChanged', {
      orderId: id,
      tableNumber: order.table.number,
      status: order.status,
    });
  }

  res.json({ success: true, data: order });
};
