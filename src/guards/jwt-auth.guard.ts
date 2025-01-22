import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const response = context.switchToHttp().getResponse<Response>();

    if (err || !user) {
      // Redirect to login if unauthorized
      response.redirect('/login');
      return null;
    }

    return user;
  }
}
