import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorResponseDto } from '@lightning-pos/http-response';

const JWT_SECRET = process.env.JWT_SECRET as string;

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(ErrorResponseDto.of('401', 'Unauthorized'));
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json(ErrorResponseDto.of('401', 'Invalid token'));
  }
}

export function requireScope(requiredScope: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const scope = ((req as any).user?.scope as string | undefined) ?? '';
    const grantedScopes = scope.split(' ');

    if (!grantedScopes.includes(requiredScope)) {
      res.status(403).json(ErrorResponseDto.of('403', 'Insufficient scope'));
      return;
    }

    next();
  };
}

// tokens issued before login carried tid/mid/sid are rejected so the cashier logs in again
export function requireTerminal(req: Request, res: Response, next: NextFunction): void {
  const { tid, mid, sid } = (req as any).user ?? {};
  if (!tid || !mid || !sid) {
    res.status(401).json(ErrorResponseDto.of('401', 'Token has no terminal, please login again'));
    return;
  }

  next();
}
