import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRequiredEnv, getRequiredEnvNumber } from './config/required-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = getRequiredEnv('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin,
  });
  await app.listen(getRequiredEnvNumber('PORT'));
}
bootstrap();
