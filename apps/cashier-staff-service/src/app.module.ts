import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/AuthController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { StaffRepository } from './domain/repositories/StaffRepository';
import { InMemoryStaffRepository } from './infrastructure/repositories/InMemoryStaffRepository';

@Module({
  imports: [
    JwtModule.register({
      secret: 'pos-staff-secret-key', // Use a secure key (e.g., from env) in production
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: StaffRepository,
      useClass: InMemoryStaffRepository,
    },
  ],
})
export class AppModule {}
