import 'dotenv/config';
import { createDatabase } from '@lightning-pos/database';
import { SqliteTerminalRepositoryImpl } from './infrastructure/repositories/SqliteTerminalRepositoryImpl';
import { SqliteStaffRepositoryImpl } from './infrastructure/repositories/SqliteStaffRepositoryImpl';
import { HttpTerminalCenterGatewayImpl } from './infrastructure/gateways/HttpTerminalCenterGatewayImpl';
import { ActivateTerminalUseCase } from './application/usecases/ActivateTerminalUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3007;
const APP_MODE = process.env.APP_MODE === 'offline' ? 'offline' : 'online';

const db = createDatabase();
const terminalRepository = new SqliteTerminalRepositoryImpl(db);
const staffRepository = new SqliteStaffRepositoryImpl(db);
const terminalCenterGateway = new HttpTerminalCenterGatewayImpl();
const activateTerminalUseCase = new ActivateTerminalUseCase(
  terminalRepository,
  terminalCenterGateway,
  staffRepository,
  APP_MODE,
);

const app = createApp(activateTerminalUseCase);

app.listen(PORT, () => {
  console.log(`Terminal Service is running on http://localhost:${PORT}`);
});
