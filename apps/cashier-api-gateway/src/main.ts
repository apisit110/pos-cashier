import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requestLogger } from './middlewares/requestLogger';

const PORT = process.env.PORT ?? 3000;

const AUTHEN_SERVICE_URL = process.env.AUTHEN_SERVICE_URL ?? 'http://localhost:3005';
const MEMBERS_SERVICE_URL = process.env.MEMBERS_SERVICE_URL ?? 'http://localhost:3004';
const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL ?? 'http://localhost:3002';
const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL ?? 'http://localhost:3001';
const TERMINAL_SERVICE_URL = process.env.TERMINAL_SERVICE_URL ?? 'http://localhost:3007';
const TRANSACTIONS_SERVICE_URL = process.env.TRANSACTIONS_SERVICE_URL ?? 'http://localhost:3006';

const app = express();

app.use(cors());

// Parse JSON and keep raw bytes so the proxy can re-stream them
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(requestLogger);

// Re-stream the raw body so the proxy can forward it after express.json() consumed the stream
function createProxy(target: string, mountPath: string) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => mountPath + path,
    on: {
      proxyReq: (proxyReq, req: any) => {
        if (req.rawBody?.length) {
          proxyReq.setHeader('Content-Length', req.rawBody.length);
          proxyReq.write(req.rawBody);
        }
      },
    },
  });
}

app.use('/api/v1/authen', createProxy(AUTHEN_SERVICE_URL, '/api/v1/authen'));
app.use('/api/v1/members', createProxy(MEMBERS_SERVICE_URL, '/api/v1/members'));
app.use('/api/v1/orders', createProxy(ORDERS_SERVICE_URL, '/api/v1/orders'));
app.use('/api/v1/products', createProxy(PRODUCTS_SERVICE_URL, '/api/v1/products'));
app.use('/api/v1/terminal', createProxy(TERMINAL_SERVICE_URL, '/api/v1/terminal'));
app.use('/api/v1/transactions', createProxy(TRANSACTIONS_SERVICE_URL, '/api/v1/transactions'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
