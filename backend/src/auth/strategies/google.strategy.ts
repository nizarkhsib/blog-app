import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '../../core/config/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');

    if (!clientID || !clientSecret) {
      throw new Error(
        'Google OAuth environment variables GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL:
        configService.get('GOOGLE_CALLBACK_URL') ||
        'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const user = await this.authService.validateOrCreateGoogleUser(profile);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
