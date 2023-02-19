import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { configuration, validationSchema } from '../config';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.development.env',
          load: [configuration],
          validationSchema,
        }),
        JwtModule,
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('generateJwt', () => {
    it('generates a jwt', async () => {
      const user = new User(
        faker.internet.email(),
        faker.name.firstName(),
        faker.name.lastName(),
      );
      const jwt = await service.generateJwt(user);
      expect(jwt).toBeTruthy();
    });
  });
});
