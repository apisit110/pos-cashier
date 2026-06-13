import 'dotenv/config';
import { createDatabase } from './infrastructure/database/DatabaseImpl';
import { SqliteMemberRepositoryImpl } from './infrastructure/repositories/SqliteMemberRepositoryImpl';
import { GetMemberByIdUseCase } from './domain/use-cases/GetMemberByIdUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3004;

const db = createDatabase();
const memberRepository = new SqliteMemberRepositoryImpl(db);
const getMemberByIdUseCase = new GetMemberByIdUseCase(memberRepository);

const app = createApp(getMemberByIdUseCase);

app.listen(PORT, () => {
  console.log(`Cashier Members Service is running on: http://localhost:${PORT}`);
});
