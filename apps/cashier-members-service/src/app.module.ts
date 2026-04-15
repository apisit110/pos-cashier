import { Module } from '@nestjs/common';
import { MemberController } from './presentation/controllers/MemberController';
import { GetMemberByIdUseCase } from './application/use-cases/GetMemberByIdUseCase';
import { DatabaseProvider } from './infrastructure/database/database.provider';
import { SqliteMemberRepository } from './infrastructure/repositories/SqliteMemberRepository';

@Module({
  imports: [],
  controllers: [MemberController],
  providers: [
    DatabaseProvider,
    {
      provide: 'MemberRepository',
      useClass: SqliteMemberRepository,
    },
    GetMemberByIdUseCase,
  ],
})
export class AppModule {}
