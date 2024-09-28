import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTConstants } from 'src/common/constants';

/**
 * This class is used to validate the jwt token.
 * It is used for all the requests where we need to authenticate the user.
 * Usage pattern: @UseGuards(AuthGuard('jwt'))
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWTConstants.secret,
    });
  }
  async validate(payload: any) {
    const user = await this.authService.validateJwtToken(payload);

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
