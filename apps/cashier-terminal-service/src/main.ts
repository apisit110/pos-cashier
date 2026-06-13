import 'dotenv/config';
import { createDatabase } from './infrastructure/database/DatabaseImpl';
import { SqliteTerminalRepositoryImpl } from './infrastructure/repositories/SqliteTerminalRepositoryImpl';
import { ActivateTerminalUseCase } from './domain/use-cases/ActivateTerminalUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3007;

const db = createDatabase();
const terminalRepository = new SqliteTerminalRepositoryImpl(db);
const activateTerminalUseCase = new ActivateTerminalUseCase(terminalRepository);

const app = createApp(activateTerminalUseCase);

app.listen(PORT, () => {
  console.log(`Terminal Service is running on http://localhost:${PORT}`);
});
