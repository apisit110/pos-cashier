import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireScope(requiredScope: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const scope = ((req as any).user?.scope as string | undefined) ?? '';
    const grantedScopes = scope.split(' ');

    if (!grantedScopes.includes(requiredScope)) {
      res.status(403).json({ message: 'Insufficient scope' });
      return;
    }

    next();
  };
}
