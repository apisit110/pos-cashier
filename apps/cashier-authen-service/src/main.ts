import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const required = ['MID', 'MANAGER_USERNAME', 'MANAGER_NAME', 'MANAGER_PIN'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3005);
  console.log('Staff Auth Service is running on http://localhost:3005');
}
bootstrap();
