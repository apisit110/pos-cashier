import express, { Application } from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import { memberRoutes } from './routes/memberRoutes';
import { GetMemberByIdUseCase } from '../domain/use-cases/GetMemberByIdUseCase';

export function createApp(getMemberByIdUseCase: GetMemberByIdUseCase): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/v1/members', authMiddleware, memberRoutes(getMemberByIdUseCase));

  return app;
}
