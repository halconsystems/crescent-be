import * as crypto from 'crypto';

export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getRefreshTokenExpiresAt(from: Date = new Date()): Date {
  return new Date(from.getTime() + REFRESH_TOKEN_TTL_MS);
}
