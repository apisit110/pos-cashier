import 'dotenv/config';

const required = ['MID', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

import { createDatabase } from '@lightning-pos/database';
import { SqliteStaffRepositoryImpl } from './infrastructure/repositories/SqliteStaffRepositoryImpl';
import { SqliteStaffPinRepositoryImpl } from './infrastructure/repositories/SqliteStaffPinRepositoryImpl';
import { SqlitePermissionRepositoryImpl } from './infrastructure/repositories/SqlitePermissionRepositoryImpl';
import { SqliteTerminalRepositoryImpl } from './infrastructure/repositories/SqliteTerminalRepositoryImpl';
import { SyncQueueServiceImpl } from './infrastructure/queue/SyncQueueServiceImpl';
import { LoginUseCase } from './application/usecases/LoginUseCase';
import { CreateStaffUseCase } from './application/usecases/CreateStaffUseCase';
import { GetStaffsUseCase } from './application/usecases/GetStaffsUseCase';
import { SyncStaffsUseCase } from './application/usecases/SyncStaffsUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3005;
const APP_MODE = process.env.APP_MODE === 'offline' ? 'offline' : 'online';

const db = createDatabase();
const staffRepository = new SqliteStaffRepositoryImpl(db);
const staffPinRepository = new SqliteStaffPinRepositoryImpl(db);
const permissionRepository = new SqlitePermissionRepositoryImpl(db);
const terminalRepository = new SqliteTerminalRepositoryImpl(db);
const syncQueueService = new SyncQueueServiceImpl();

const loginUseCase = new LoginUseCase(
  staffRepository,
  staffPinRepository,
  permissionRepository,
  terminalRepository,
  syncQueueService,
  APP_MODE,
);
const getStaffsUseCase = new GetStaffsUseCase(staffRepository);
const createStaffUseCase = new CreateStaffUseCase(staffRepository, staffPinRepository);
const syncStaffsUseCase = new SyncStaffsUseCase(syncQueueService, APP_MODE);

const app = createApp(loginUseCase, getStaffsUseCase, createStaffUseCase, syncStaffsUseCase);

app.listen(PORT, () => {
  console.log(`Staff Auth Service is running on http://localhost:${PORT}`);
});
