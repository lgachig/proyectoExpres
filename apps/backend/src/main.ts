import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRequiredEnv, getRequiredEnvNumber } from './config/required-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = getRequiredEnv('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin,
    'http://localhost:5173': 'http://34.238.172.135:5173',
  });
  await app.listen(getRequiredEnvNumber('PORT'));
}
bootstrap();
