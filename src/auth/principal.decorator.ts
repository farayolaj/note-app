import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.entity';

export const Principal = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const userInfo = ctx.switchToHttp().getRequest<Request>().user;
    return data ? userInfo?.[data] : userInfo;
  },
);
