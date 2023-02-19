import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailConflictException } from './exception/email-conflict-exception';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Note } from '../note/note.entity';
import { TypeOrmTestModule } from '../testing/type-orm.module';
import { UnauthorizedException } from '@nestjs/common';

const getUserDto = () => {
  const userDto = new CreateUserDto();
  userDto.email = faker.internet.email();
  userDto.firstName = faker.name.firstName();
  userDto.lastName = faker.name.lastName();
  userDto.password = faker.internet.password();

  return userDto;
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, TypeOrmModule.forFeature([User, Note])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    afterEach(async () => {
      await repository.clear();
    });

    it('creates user successfully', async () => {
      const userDto = getUserDto();
      const user = await service.createUser(userDto);
      expect(user.id).toBeTruthy();
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
      expect(user.password).not.toEqual(userDto.password);
    });
  });

  describe('verifyUser', () => {
    it('verifies a user successfully', async () => {
      const userDto = getUserDto();
      await service.createUser(userDto);
      const verified = await service.verifyUser(
        userDto.email,
        userDto.password,
      );
      expect(verified).toBeInstanceOf(User);
    });

    it('fails on a wrong password', async () => {
      const userDto = getUserDto();
      await service.createUser(userDto);
      expect(
        service.verifyUser(userDto.email, 'some_other_password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
