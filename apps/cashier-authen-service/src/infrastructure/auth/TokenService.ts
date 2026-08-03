import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } from '../../config/jwt';

export interface TokenPayload {
  username: string;
  fullName: string;
  roleId: number;
  scope: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function generateTokenPair(subject: string, payload: TokenPayload): TokenPair {
  const signOptions = {
    subject,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  };

  // RFC 9068: access tokens carry a unique jti and a dedicated "at+jwt" typ header.
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    ...signOptions,
    expiresIn: '60m',
    jwtid: randomUUID(),
    header: { typ: 'at+jwt', alg: 'HS256' },
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    ...signOptions,
    expiresIn: '30d',
    jwtid: randomUUID(),
  });

  return { accessToken, refreshToken };
}
