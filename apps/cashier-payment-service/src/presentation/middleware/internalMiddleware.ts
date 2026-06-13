import { Request, Response, NextFunction } from 'express';

const INTERNAL_SECRET = process.env.INTERNAL_SECRET ?? 'lightning-pos-internal-shared-secret';

export function internalMiddleware(req: Request, res: Response, next: NextFunction): void {
  const internalKey = req.headers['x-internal-secret'];

  if (internalKey !== INTERNAL_SECRET) {
    res.status(401).json({ message: 'Invalid internal service secret' });
    return;
  }

  next();
}
