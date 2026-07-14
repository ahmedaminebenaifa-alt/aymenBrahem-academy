import * as dashboardService from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getAdminStats();
  res.status(200).json({ status: 'success', data: stats });
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const activity = await dashboardService.getRecentActivity(10);
  res.status(200).json({ status: 'success', data: activity });
});