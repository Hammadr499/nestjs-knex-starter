import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middleware/errorhandler';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(morgan('dev'));
  app.setGlobalPrefix('/v1');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Nest Js Starter')
    .setDescription('Documentation for Nest Js Starter.')
    .setVersion('1.0')
    .addServer(`${configService.get('BASE_URL')}`, 'default')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('SERVER_PORT') || 5001, function () {
    console.log(
      `Server is running on port ${configService.get('SERVER_PORT') || 5001}`,
    );
  });
})();
