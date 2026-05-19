import { Router } from 'express';
import { getCategories } from '../controllers/categoryController';
import { getProducts, getProductById } from '../controllers/productController';
import { createOrder, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { callWaiter } from '../controllers/waiterController';
import { getTableByNumber } from '../controllers/tableController';

const router = Router();

// ── CATEGORIES ──────────────────────────────
router.get('/categories', getCategories);

// ── PRODUCTS ────────────────────────────────
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// ── ORDERS ──────────────────────────────────
router.post('/orders', createOrder);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);

// ── WAITER ──────────────────────────────────
router.post('/waiter-request', callWaiter);

// ── TABLES ──────────────────────────────────
router.get('/table/:number', getTableByNumber);

export default router;
