import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // endereço front-end
    credentials: true, // enviar cookies ou headers de autenticação
  });

  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO
      forbidNonWhitelisted: true, // levanta erro se houver chave extra
      transform: false, // não transforma tipos automaticamente
    }),
  );

  await app.listen(process.env.PORT ?? 3002);
}

bootstrap();
