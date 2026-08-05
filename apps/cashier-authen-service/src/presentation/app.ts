import express, { Application } from 'express';
import cors from 'cors';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import { authRoutes } from './routes/authRoutes';
import { staffRoutes } from './routes/staffRoutes';
import { LoginUseCase } from '../domain/use-cases/LoginUseCase';
import { GetStaffsUseCase } from '../domain/use-cases/GetStaffsUseCase';
import { CreateStaffUseCase } from '../domain/use-cases/CreateStaffUseCase';
import { SyncStaffsUseCase } from '../domain/use-cases/SyncStaffsUseCase';

export function createApp(
  loginUseCase: LoginUseCase,
  getStaffsUseCase: GetStaffsUseCase,
  createStaffUseCase: CreateStaffUseCase,
  syncStaffsUseCase: SyncStaffsUseCase,
): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(loggingMiddleware);

  app.use('/api/v1/authen/auth', authRoutes(loginUseCase));
  app.use(
    '/api/v1/authen/staffs',
    authMiddleware,
    staffRoutes(getStaffsUseCase, createStaffUseCase, syncStaffsUseCase),
  );

  return app;
}
