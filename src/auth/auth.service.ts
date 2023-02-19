import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateJwt(data: User) {
    const secret = this.configService.get<string>('jwt.secret');
    const jwt = await this.jwtService.signAsync(
      { sub: data.id },
      { expiresIn: '7d', secret },
    );
    return jwt;
  }
}
