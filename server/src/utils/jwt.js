import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwtAccessSecret, { expiresIn: ACCESS_TOKEN_TTL });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);

// Refresh tokens are opaque random strings, not JWTs — nothing meaningful to decode,
// which limits what an attacker learns even if one leaks.
export const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const getRefreshExpiry = () => new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

export { REFRESH_TOKEN_TTL_MS };