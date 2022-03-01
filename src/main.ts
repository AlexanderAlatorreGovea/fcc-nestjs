import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const Validation = new ValidationPipe({
    whitelist: true,
  });
  const PORT = 3001;

  app.useGlobalPipes(Validation);

  await app.listen(PORT);
}
bootstrap();
