import 'dotenv/config';

const required = ['MID', 'MANAGER_USERNAME', 'MANAGER_NAME', 'MANAGER_PIN', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

import { createDatabase } from '@lightning-pos/database';
import { SqliteStaffRepositoryImpl } from './infrastructure/repositories/SqliteStaffRepositoryImpl';
import { HttpStaffSyncGatewayImpl } from './infrastructure/gateways/HttpStaffSyncGatewayImpl';
import { LoginUseCase } from './domain/use-cases/LoginUseCase';
import { CreateStaffUseCase } from './domain/use-cases/CreateStaffUseCase';
import { GetStaffsUseCase } from './domain/use-cases/GetStaffsUseCase';
import { SyncStaffsUseCase } from './domain/use-cases/SyncStaffsUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3005;

const db = createDatabase();
const staffRepository = new SqliteStaffRepositoryImpl(db);
const staffSyncGateway = new HttpStaffSyncGatewayImpl();

const loginUseCase = new LoginUseCase(staffRepository);
const getStaffsUseCase = new GetStaffsUseCase(staffRepository);
const createStaffUseCase = new CreateStaffUseCase(staffRepository);
const syncStaffsUseCase = new SyncStaffsUseCase(staffRepository, staffSyncGateway);

const app = createApp(loginUseCase, getStaffsUseCase, createStaffUseCase, syncStaffsUseCase);

app.listen(PORT, () => {
  console.log(`Staff Auth Service is running on http://localhost:${PORT}`);
});
