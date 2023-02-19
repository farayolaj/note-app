import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConflictException } from './exception/email-conflict-exception';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Note } from '../note/note.entity';
import { TypeOrmTestModule } from '../testing/type-orm.module';
import { UnauthorizedException } from '@nestjs/common';
import { generateUserDto } from '../common/testing/generators';
import { UpdatePasswordDto } from './dto/update-password.dto';

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
      const userDto = generateUserDto();
      const user = await service.createUser(userDto);
      expect(user.id).toBeTruthy();
    });

    it('fails on email conflict', async () => {
      const userDto = generateUserDto();
      await service.createUser(userDto);
      expect(service.createUser(userDto)).rejects.toThrow(
        EmailConflictException,
      );
    });

    it('hashes password', async () => {
      const userDto = generateUserDto();
      const user = await service.createUser(userDto);
      expect(user.password).not.toEqual(userDto.password);
    });
  });

  describe('verifyUser', () => {
    it('verifies a user successfully', async () => {
      const userDto = generateUserDto();
      await service.createUser(userDto);
      const verified = await service.verifyUser(
        userDto.email,
        userDto.password,
      );
      expect(verified).toBeInstanceOf(User);
    });

    it('fails on a wrong password', async () => {
      const userDto = generateUserDto();
      await service.createUser(userDto);
      expect(
        service.verifyUser(userDto.email, 'some_other_password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updatePassword', () => {
    it('updates password successfully', async () => {
      const userDto = generateUserDto();
      const user = await service.createUser(userDto);
      const passwordDto = new UpdatePasswordDto();
      passwordDto.newPassword = 'new_password';
      passwordDto.oldPassword = userDto.password;
      await service.updatePassword(user.id, passwordDto);
      expect(
        service.verifyUser(userDto.email, passwordDto.newPassword),
      ).resolves.toBeInstanceOf(User);
    });
  });
});
