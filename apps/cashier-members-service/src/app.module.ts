import { Module } from '@nestjs/common';
import { MemberController } from './presentation/controllers/MemberController';
import { GetMemberByIdUseCase } from './application/use-cases/GetMemberByIdUseCase';

@Module({
  imports: [],
  controllers: [MemberController],
  providers: [GetMemberByIdUseCase],
})
export class AppModule {}
