import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    console.log('call constructor');
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('Validate done');

    const user = await this.authService.validateUser(username, password);
    if (!user?.success) {
      throw new UnauthorizedException(user.message);
    }
    return user;
  }
}
