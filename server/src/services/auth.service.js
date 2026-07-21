import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  getRefreshExpiry,
} from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import crypto from 'crypto';

const DUMMY_HASH = '$2b$10$invalidsaltinvalidsaltinvalidsaltinvali';

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  profileImage: user.profileImage,
  phoneNumber: user.phoneNumber,
  birthDate: user.birthDate,
});

// Issues a fresh access + refresh token pair for a brand-new session (login/register).
// Starts a new rotation family.
const issueNewSession = async (user) => {
  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });

  const refreshToken = generateRefreshToken();
  const family = crypto.randomUUID();

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      family,
      expiresAt: getRefreshExpiry(),
    },
  });

  return { accessToken, refreshToken, user: publicUser(user) };
};

export const registerUser = async ({ email, password, name }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, role: 'STUDENT' },
  });

  return issueNewSession(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  const isValid = await comparePassword(password, user?.password ?? DUMMY_HASH);

  if (!user || !isValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  return issueNewSession(user);
};

// Rotates a refresh token: validates it, revokes it, issues a new access + refresh pair
// in the same family. If the presented token was already revoked (reuse of a stolen or
// already-rotated token), the entire family is killed — every session on that device chain
// is forced to log in again, matching the "someone used your old token" defense big platforms use.
export const refreshSession = async (rawToken) => {
  if (!rawToken) throw new ApiError(401, 'No refresh token provided');

  const tokenHash = hashToken(rawToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (stored.revoked) {
    // Reuse detected — this token was already rotated away once before.
    // Kill the whole family: every device/session descended from this login.
    await prisma.refreshToken.updateMany({
      where: { family: stored.family },
      data: { revoked: true },
    });
    throw new ApiError(401, 'Session invalidated — please log in again');
  }

  if (stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Refresh token expired');
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  // Rotate: revoke the used token, issue a new one in the same family
  const newRefreshToken = generateRefreshToken();

  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefreshToken),
        family: stored.family,
        expiresAt: getRefreshExpiry(),
      },
    }),
  ]);

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });

  return { accessToken, refreshToken: newRefreshToken, user: publicUser(user) };
};

// Logout — revoke just this device's session
export const revokeRefreshToken = async (rawToken) => {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
};

// "Log out all devices" — revoke every session for this user
export const revokeAllSessions = async (userId) => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};