import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { ConfigService } from '../../core/config/config.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get('FACEBOOK_APP_ID');
    const clientSecret = configService.get('FACEBOOK_APP_SECRET');

    if (!clientID || !clientSecret) {
      throw new Error(
        'Facebook OAuth environment variables FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be set',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL:
        configService.get('FACEBOOK_CALLBACK_URL') ||
        'http://localhost:3000/auth/facebook/callback',
      scope: ['profile', 'email'],
      profileFields: ['id', 'displayName', 'photos', 'emails'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const user = await this.authService.validateOrCreateFacebookUser(profile);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
