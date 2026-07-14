import * as orderService from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { courseId, note } = req.body;
  const result = await orderService.createOrder({ userId: req.user.id, courseId, note });
  res.status(201).json({ status: 'success', ...result });
});

export const approveOrder = asyncHandler(async (req, res) => {
  const order = await orderService.approveOrder(req.params.id, req.user.id);
  res.status(200).json({ status: 'success', order });
});

export const rejectOrder = asyncHandler(async (req, res) => {
  const order = await orderService.rejectOrder(req.params.id, req.user.id);
  res.status(200).json({ status: 'success', order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);
  res.status(200).json({ status: 'success', data: orders });
});

export const getPendingOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getPendingOrders();
  res.status(200).json({ status: 'success', data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id);
  res.status(200).json({ status: 'success', order });
});