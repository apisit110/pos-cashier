import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/AuthController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { StaffRepository } from './domain/repositories/StaffRepository';
import { SqliteStaffRepository } from './infrastructure/repositories/SqliteStaffRepository';
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
      provide: StaffRepository,
      useClass: SqliteStaffRepository,
    },
    LoginUseCase,
  ],
})
export class AppModule {}
