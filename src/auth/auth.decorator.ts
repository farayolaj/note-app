import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  applyDecorators,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from './jwt.guard';

export const Auth = () => {
  return applyDecorators(
    UseGuards(JWTAuthGuard),
    ApiBearerAuth(),
    ApiException(() => UnauthorizedException, {
      description:
        'Unauthorized. Include a valid access token in the authorization header',
    }),
  );
};
