import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_JWT_SECRET || '',
    });
  }

  /**
   * Extract JWT from cookies.
   * @param req Express request object.
   * @returns JWT string or null if not present.
   */
  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'auth_token' in req.cookies &&
      req.cookies.auth_token.length > 0
    ) {
      return req.cookies.auth_token;
    }
    console.log('No auth_token in cookies', req.cookies);
    return null;
  }

  /**
   * Validate and attach the payload to the request user.
   * @param payload Decoded JWT payload.
   * @returns User object.
   */
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.username };
  }
}
