import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/AuthController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { UserRepository } from './domain/repositories/UserRepository';
import { SqliteUserRepository } from './infrastructure/repositories/SqliteUserRepository';
import { RoleRepository } from './domain/repositories/RoleRepository';
import { SqliteRoleRepository } from './infrastructure/repositories/SqliteRoleRepository';
import { PermissionRepository } from './domain/repositories/PermissionRepository';
import { SqlitePermissionRepository } from './infrastructure/repositories/SqlitePermissionRepository';
import { DatabaseProvider } from './infrastructure/database/database.provider';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'pos-staff-secret-key', // Use a secure key (e.g., from env) in production
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
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
    LoginUseCase,
  ],
})
export class AppModule {}
