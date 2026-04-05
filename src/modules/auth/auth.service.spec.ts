import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { AuthService } from './auth.service';

const prismaMock = {
  appUser: {
    findUnique: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
        }),
      ],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should validate user with correct password', async () => {
    const hash = await argon2.hash('Password1!');
    prismaMock.appUser.findUnique.mockResolvedValue({
      userId: 1,
      email: 'jdoe@example.com',
      passwordHash: hash,
    });

    const result = await service.validateUser('jdoe@example.com', 'Password1!');
    expect(result.userId).toBe(1);
    expect(result.email).toBe('jdoe@example.com');
  });
});

