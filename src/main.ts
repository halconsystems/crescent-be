import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Crescent API')
    .setDescription(
      'REST API for onboarding and reference data. Base path for resources is `/api/v1/...`. ' +
        'Sensitive fields (passwords, token hashes) are never returned where noted in operation summaries.',
    )
    .setVersion('1.0')
    .addTag('Clients', 'Legacy client records')
    .addTag('Offices')
    .addTag('Zones')
    .addTag('Products')
    .addTag('Banks')
    .addTag('Bank accounts')
    .addTag('Cities')
    .addTag('Vendors')
    .addTag('Roles')
    .addTag('Employees')
    .addTag('App users')
    .addTag('User roles')
    .addTag('Password reset tokens')
    .addTag('User password history')
    .addTag('User sessions')
    .addTag('Client categories')
    .addTag('Packages')
    .addTag('Zone employees')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
