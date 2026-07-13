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

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { type, title, message, scheduledFor, link } = req.body;
  const notification = await notificationService.createAnnouncement({ type, title, message, scheduledFor, link });
  res.status(201).json({ status: 'success', notification });
});

export const getUpcomingAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await notificationService.getUpcomingAnnouncements();
  res.status(200).json({ status: 'success', data: announcements });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { type, title, message, scheduledFor, link } = req.body;
  const notification = await notificationService.updateAnnouncement(req.params.id, { type, title, message, scheduledFor, link });
  res.status(200).json({ status: 'success', notification });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  await notificationService.deleteAnnouncement(req.params.id);
  res.status(200).json({ status: 'success' });
});