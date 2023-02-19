import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailConflictException } from './exception/email-conflict-exception';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * @throws EmailConflictException
   */
  async createUser(userDto: CreateUserDto) {
    let user = await this.userRepository.findOneBy({ email: userDto.email });

    if (user) throw new EmailConflictException();

    user = new User(userDto.email, userDto.firstName, userDto.lastName);
    await user.setPassword(userDto.password);
    return await this.userRepository.save(user);
  }

  /**
   * Returns user information if the email and password are correct, else it throws an UnauthorizedException
   * @throws UnauthorizedException
   */
  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (user && (await user.comparePassword(password))) return user;

    throw new UnauthorizedException();
  }

  /**
   * @throws UserNotFoundException
   */
  async getUserById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new UserNotFoundException();

    return user;
  }

  /**
   * @throws UserNotFoundException
   */
  async deleteUser(userId: string) {
    const user = await this.getUserById(userId);
    await this.userRepository.remove(user);
  }

  /**
   * @throws UserNotFoundException
   */
  async updateUser(userId: string, userDto: UpdateUserDto) {
    let user = await this.getUserById(userId);
    user = this.userRepository.merge(user, userDto);
    return await this.userRepository.save(user);
  }

  /**
   * @throws UserNotFoundException, UnauthorizedException
   */
  async updatePassword(userId: string, passwordDto: UpdatePasswordDto) {
    const user = await this.getUserById(userId);

    if (!user.comparePassword(passwordDto.oldPassword))
      throw new UnauthorizedException('Incorrect old password');

    await user.setPassword(passwordDto.newPassword);
    await this.userRepository.save(user);
  }
}
