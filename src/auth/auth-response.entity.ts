import { User } from '../user/user.entity';

export class AuthResponse {
  user: User;
  token: string;

  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }
}
