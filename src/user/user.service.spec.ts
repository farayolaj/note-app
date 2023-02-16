import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockReset } from 'jest-mock-extended';
import { mockRepositoryFactory } from '../common/mocks';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailConflictException } from './exception/email-conflict-exception';
import { User } from './user.entity';
import { UserService } from './user.service';

const getUserDto = () => {
  const userDto = new CreateUserDto();
  userDto.email = 'someName@gmail.com';
  userDto.firstName = 'Somto';
  userDto.lastName = 'Adekunle';
  userDto.password = 'Some_Secure_Password';

  return userDto;
};

describe('UserService', () => {
  const mockRepository = mockRepositoryFactory<User>();
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    beforeEach(() => {
      const map = new Map<string, User>();
      mockRepository.save.mockImplementation(async (entity) => {
        const user = entity as User;
        user.id = 'uuid';
        map.set(user.email, user);
        return user;
      });

      mockRepository.findOneBy.mockImplementation(async (where) => {
        if (Array.isArray(where)) where = where[0];

        const user = map.get(where.email as string);
        return user;
      });
    });

    afterEach(() => {
      mockReset(mockRepository);
    });

    it('creates user successfully', async () => {
      const userDto = getUserDto();
      const user = await service.createUser(userDto);
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(user.id).toBe('uuid');
    });

    it('fails on email conflict', async () => {
      const userDto = getUserDto();
      await service.createUser(userDto);
      expect(service.createUser(userDto)).rejects.toThrow(
        EmailConflictException,
      );
    });

    it('hashes password', async () => {
      const userDto = getUserDto();
      const user = await service.createUser(userDto);
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(user.password).not.toEqual(userDto.password);
    });
  });

  describe('verifyUser', () => {
    beforeEach(() => {
      const map = new Map<string, User>();
      mockRepository.save.mockImplementation(async (entity) => {
        const user = entity as User;
        user.id = 'uuid';
        map.set(user.email, user);
        return user;
      });

      mockRepository.findOneBy.mockImplementation(async (where) => {
        if (Array.isArray(where)) where = where[0];

        const user = map.get(where.email as string);
        return user;
      });
    });

    it('verifies a user successfully', async () => {
      const userDto = getUserDto();
      await service.createUser(userDto);
      const verified = await service.verifyUser(
        userDto.email,
        userDto.password,
      );
      expect(verified).toBe(true);
    });

    it('fails on a wrong password', async () => {
      const userDto = getUserDto();
      await service.createUser(userDto);
      const verified = await service.verifyUser(
        userDto.email,
        'some_other_password',
      );
      expect(verified).toBe(false);
    });
  });
});
