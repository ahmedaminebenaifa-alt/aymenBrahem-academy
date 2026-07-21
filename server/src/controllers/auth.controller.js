import prisma from '../config/db.js';
import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { REFRESH_TOKEN_TTL_MS } from '../utils/jwt.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_PATH = '/api/auth'; // scoped narrowly — only sent to auth routes

const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction, // HTTPS only in prod; allow http on localhost for dev
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    domain: env.cookieDomain,
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    domain: env.cookieDomain,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.registerUser(req.body);
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ accessToken, user });
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(req.body);
  setRefreshCookie(res, refreshToken);
  res.status(200).json({ accessToken, user });
});

export const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const { accessToken, refreshToken, user } = await authService.refreshSession(rawToken);
  setRefreshCookie(res, refreshToken);
  res.status(200).json({ accessToken, user });
});

export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  await authService.revokeRefreshToken(rawToken);
  clearRefreshCookie(res);
  res.status(200).json({ status: 'success' });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.revokeAllSessions(req.user.id);
  clearRefreshCookie(res);
  res.status(200).json({ status: 'success' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      profileImage: true,
      phoneNumber: true,
      birthDate: true,
    },
  });
  res.json(user);
});