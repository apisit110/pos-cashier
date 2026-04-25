import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/AuthController';
import { UserController } from './presentation/controllers/UserController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { GetUsersUseCase } from './application/use-cases/GetUsersUseCase';
import { CreateUserUseCase as BackendCreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { UserRepository } from './domain/repositories/UserRepository';
import { SqliteUserRepository } from './infrastructure/repositories/SqliteUserRepository';
import { RoleRepository } from './domain/repositories/RoleRepository';
import { SqliteRoleRepository } from './infrastructure/repositories/SqliteRoleRepository';
import { PermissionRepository } from './domain/repositories/PermissionRepository';
import { SqlitePermissionRepository } from './infrastructure/repositories/SqlitePermissionRepository';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { LoggingInterceptor } from './presentation/interceptors/LoggingInterceptor';
import { SyncUsersUseCase } from './application/use-cases/SyncUsersUseCase';
import { HttpUserSyncGateway } from './infrastructure/repositories/HttpUserSyncGateway';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'pos-staff-secret-key', // Use a secure key (e.g., from env) in production
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    DatabaseProvider,
    {
      provide: UserRepository,
      useClass: SqliteUserRepository,
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
      provide: 'UserSyncGateway',
      useClass: HttpUserSyncGateway,
    },
    LoginUseCase,
    GetUsersUseCase,
    BackendCreateUserUseCase,
    SyncUsersUseCase,
  ],
})
export class AppModule {}
