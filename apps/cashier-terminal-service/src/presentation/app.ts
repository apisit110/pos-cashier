import express, { Application } from 'express';
import cors from 'cors';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { terminalRoutes } from './routes/terminalRoutes';
import { ActivateTerminalUseCase } from '../domain/use-cases/ActivateTerminalUseCase';

export function createApp(activateTerminalUseCase: ActivateTerminalUseCase): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(loggingMiddleware);

  app.use('/api/v1/terminal', terminalRoutes(activateTerminalUseCase));

  return app;
}
