import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verifyAuth, orderController.createOrder);
router.get('/mine', verifyAuth, orderController.getMyOrders);
router.get('/:id', verifyAuth, orderController.getOrderById);

router.get('/admin/pending', verifyAuth, requireRole('ADMIN'), orderController.getPendingManualOrders);
router.post('/:id/approve', verifyAuth, requireRole('ADMIN'), orderController.approveManualOrder);
router.post('/:id/reject', verifyAuth, requireRole('ADMIN'), orderController.rejectManualOrder);

export default router;