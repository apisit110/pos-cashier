import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/AuthController';
import { StaffController } from './presentation/controllers/StaffController';
import { InternalStaffController } from './presentation/controllers/InternalStaffController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { GetStaffsUseCase } from './application/use-cases/GetStaffsUseCase';
import { GetStaffByIdUseCase } from './application/use-cases/GetStaffByIdUseCase';
import { CreateStaffUseCase } from './application/use-cases/CreateStaffUseCase';
import { StaffRepository } from './domain/repositories/StaffRepository';
import { SqliteStaffRepository } from './infrastructure/repositories/SqliteStaffRepository';
import { RoleRepository } from './domain/repositories/RoleRepository';
import { SqliteRoleRepository } from './infrastructure/repositories/SqliteRoleRepository';
import { PermissionRepository } from './domain/repositories/PermissionRepository';
import { SqlitePermissionRepository } from './infrastructure/repositories/SqlitePermissionRepository';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { LoggingInterceptor } from './presentation/interceptors/LoggingInterceptor';
import { SyncStaffsUseCase } from './application/use-cases/SyncStaffsUseCase';
import { HttpStaffSyncGateway } from './infrastructure/repositories/HttpStaffSyncGateway';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'pos-staff-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController, StaffController, InternalStaffController],
  providers: [
    DatabaseProvider,
    {
      provide: StaffRepository,
      useClass: SqliteStaffRepository,
    },
    {
      provide: RoleRepository,
      useClass: SqliteRoleRepository,
    },
    {
      provide: PermissionRepository,
      useClass: SqlitePermissionRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: 'StaffSyncGateway',
      useClass: HttpStaffSyncGateway,
    },
    LoginUseCase,
    GetStaffsUseCase,
    GetStaffByIdUseCase,
    CreateStaffUseCase,
    SyncStaffsUseCase,
  ],
})
export class AppModule {}
