import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import dayjs, { type Dayjs } from '@lightning-pos/datetime';

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw || undefined;
  }
}

function logRequest(uuid: string, req: Request) {
  const params = JSON.stringify({ ...req.params, ...req.query });
  const body = JSON.stringify(req.body);
  console.log(
    `[req] [${uuid}] ${dayjs.utc().format()} ${req.method} ${req.url} params=${params} body=${body}`,
  );
}

function logResponse(uuid: string, reqTime: Dayjs, res: Response, body: unknown) {
  const duration = dayjs.utc().diff(reqTime);
  console.log(
    `[res] [${uuid}] ${dayjs.utc().format()} ${res.statusCode} ${duration}ms body=${JSON.stringify(body)}`,
  );
}

function logError(uuid: string, reqTime: Dayjs, err: unknown) {
  const duration = dayjs.utc().diff(reqTime);
  const message = err instanceof Error ? err.message : String(err);
  console.error(
    `[error] [${uuid}] ${dayjs.utc().format()} ${duration}ms ${message}`,
  );
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const uuid = crypto.randomUUID();
  const reqTime = dayjs.utc();

  logRequest(uuid, req);

  const chunks: Buffer[] = [];
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  (res as any).write = (chunk: any, ...args: any[]) => {
    if (chunk != null && typeof chunk !== 'function') {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return (originalWrite as any)(chunk, ...args);
  };

  (res as any).end = (chunk: any, ...args: any[]) => {
    if (chunk != null && typeof chunk !== 'function' && chunk !== '') {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    let body: unknown;
    try {
      body = tryParseJson(Buffer.concat(chunks).toString('utf8'));
    } catch (err) {
      logError(uuid, reqTime, err);
      body = '[binary]';
    }

    logResponse(uuid, reqTime, res, body);

    return (originalEnd as any)(chunk, ...args);
  };

  next();
}
