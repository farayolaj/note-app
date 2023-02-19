import {
  ValidationPipe,
  ClassSerializerInterceptor,
  Logger,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = parseInt(process.env.PORT) || 3000;

  const config = new DocumentBuilder()
    .setTitle('Note Application')
    .setDescription('A simple API service for a note application.')
    .setVersion('0.0.1')
    .addServer(`http://localhost:${port}`, 'Local Server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi-ui', app, document);

  const logger = new Logger('NestApplication');
  await app.listen(3000, () => logger.log(`Listening on port ${port}`));
}

bootstrap();
