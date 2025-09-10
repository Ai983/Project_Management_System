import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cs: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: cs.get('AUTH0_AUDIENCE'),
      issuer: `https://${cs.get('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
    });
  }
  async validate(payload: any) {
    // returns user object attached to req.user
    return { userId: payload.sub, roles: payload['http://yourapp/roles'] };
  }
}
