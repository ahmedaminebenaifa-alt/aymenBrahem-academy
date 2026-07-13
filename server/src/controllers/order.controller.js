import * as orderService from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { courseId, method, transferReference } = req.body;
  const result = await orderService.createOrder({ userId: req.user.id, courseId, method, transferReference });
  res.status(201).json({ status: 'success', ...result });
});

export const approveManualOrder = asyncHandler(async (req, res) => {
  const order = await orderService.approveManualOrder(req.params.id, req.user.id);
  res.status(200).json({ status: 'success', order });
});

export const rejectManualOrder = asyncHandler(async (req, res) => {
  const order = await orderService.rejectManualOrder(req.params.id, req.user.id);
  res.status(200).json({ status: 'success', order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);
  res.status(200).json({ status: 'success', data: orders });
});

export const getPendingManualOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getPendingManualOrders();
  res.status(200).json({ status: 'success', data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id);
  res.status(200).json({ status: 'success', order });
});