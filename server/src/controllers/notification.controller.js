import * as notificationService from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getNotificationsForUser(req.user.id);
  res.status(200).json({ status: 'success', data: notifications });
});

export const readOne = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  res.status(200).json({ status: 'success' });
});

export const readAll = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  res.status(200).json({ status: 'success', message: result.message });
});