import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for the frontend
  await app.listen(3006);
  console.log(`Transactions Service is running on: ${await app.getUrl()}`);
}
bootstrap();
