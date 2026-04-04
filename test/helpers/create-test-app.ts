import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';
import { createPrismaServiceMock, seedHappyPathMocks } from './prisma-mock';

export interface TestAppContext {
  app: INestApplication;
  prismaMock: ReturnType<typeof createPrismaServiceMock>;
  jwtService: JwtService;
}

export async function createTestApp(): Promise<TestAppContext> {
  const prismaMock = createPrismaServiceMock();
  seedHappyPathMocks(prismaMock);

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prismaMock)
    .compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();

  const jwtService = app.get(JwtService);
  return { app, prismaMock, jwtService };
}
