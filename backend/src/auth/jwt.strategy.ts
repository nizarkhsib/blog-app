import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '../core/config/config.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        // On s'assure d'obtenir une chaîne de caractères ou undefined (et jamais null)
        const secret = this.configService.get('JWT_SECRET') || process.env.JWT_SECRET;

        if (!secret) {
          // En cas d'erreur, le premier argument est l'erreur, le second doit être undefined
          return done(new Error('JWT_SECRET est introuvable dans la configuration'), undefined);
        }

        // On passe le secret validé
        done(null, secret);
      }
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUserByJwt(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}