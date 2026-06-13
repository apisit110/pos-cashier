import { Request, Response, NextFunction } from 'express';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { method, url, body } = req;
  const now = Date.now();

  console.log(`[REQUEST] ${method} ${url} - Body: ${JSON.stringify(body)}`);

  res.on('finish', () => {
    const delay = Date.now() - now;
    console.log(`[RESPONSE] ${method} ${url} - Status: ${res.statusCode} - ${delay}ms`);
  });

  next();
}
