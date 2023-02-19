import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthResponse } from './auth-response.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @ApiException(() => UnauthorizedException)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.verifyUser(
      loginDto.email,
      loginDto.password,
    );

    const token = await this.authService.generateJwt(user);
    return new AuthResponse(user, token);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userDto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userService.createUser(userDto);

    const token = await this.authService.generateJwt(user);
    return new AuthResponse(user, token);
  }
}
