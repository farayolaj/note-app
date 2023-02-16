import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const user = new User(userDto.email, userDto.firstName, userDto.lastName);
    await user.setPassword(userDto.password);
    return await this.userRepository.save(user);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    return !!user && user.comparePassword(password);
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }
}
