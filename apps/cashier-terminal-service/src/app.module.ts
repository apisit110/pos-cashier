import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminalController } from './presentation/controllers/TerminalController';
import { ActivateTerminalUseCase } from './application/use-cases/ActivateTerminalUseCase';
import { SqliteTerminalRepository } from './infrastructure/repositories/SqliteTerminalRepository';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { LoggingInterceptor } from './presentation/interceptors/LoggingInterceptor';

@Module({
  controllers: [TerminalController],
  providers: [
    DatabaseProvider,
    SqliteTerminalRepository,
    ActivateTerminalUseCase,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
