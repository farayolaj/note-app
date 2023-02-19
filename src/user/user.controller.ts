import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { UserId } from '../auth/user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Auth()
  @ApiException(() => UserNotFoundException)
  async getAuthenticatedUser(@UserId() userId: string) {
    const user = await this.userService.getUserById(userId);
    return user;
  }

  @Patch()
  @Auth()
  @ApiException(() => UserNotFoundException)
  async updateUser(@UserId() userId: string, @Body() userDto: UpdateUserDto) {
    return this.userService.updateUser(userId, userDto);
  }

  @Delete()
  @Auth()
  @ApiException(() => UserNotFoundException)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@UserId() userId: string) {
    return this.userService.deleteUser(userId);
  }
}
