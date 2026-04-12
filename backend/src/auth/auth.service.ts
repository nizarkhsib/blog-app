import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenVerifyEmail, User } from './user.model';
import { v1 as uuidv1 } from 'uuid';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { RegisterDto } from './dto/register.dto';
import { LoggedUserDto } from './dto/logged-user.dto';
import { Profile } from 'src/profile/profile.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('TokenVerifyEmail') private tokenVerifyEmailModel: Model<TokenVerifyEmail>,
    @InjectModel('Profile') private profileModel: Model<Profile>,
    private jwtService: JwtService,
    private sendEmailMiddleware: SendEmailMiddleware,
  ) { }

  async createUser(authCredentialsDto: RegisterDto) {
    const userToAttempt = await this.findOneByEmail(authCredentialsDto.email);

    if (userToAttempt) {
      throw new BadRequestException('Email already exists !');
    }

    const newUser = new this.userModel({
      firstname: authCredentialsDto.firstname,
      lastname: authCredentialsDto.lastname,
      email: authCredentialsDto.email,
      password: authCredentialsDto.password,
    });

    const createdUser = await newUser.save();

    await this.profileModel.create({ user: createdUser._id });

    await this.tokenVerifyEmailModel.create({
      userId: createdUser._id,
      tokenVerifyEmail: uuidv1(),
    });

    // Optionally send verification email here
  }

  async validateUserByPassword(authCredentialsDto: AuthCredentialsDto) {
    let userToAttempt: any = await this.findOneByEmail(authCredentialsDto.email);
    if (!userToAttempt) throw new BadRequestException('Email not found !');
    return new Promise((resolve, reject) => {
      userToAttempt.checkPassword(authCredentialsDto.password, (err, isMatch) => {
        if (err) {
          reject(new UnauthorizedException());
        }
        if (isMatch) {
          const payload: LoggedUserDto = {
            _id: userToAttempt._id,
            firstname: userToAttempt.firstname,
            lastname: userToAttempt.lastname,
            email: userToAttempt.email,
            token: this.createJwtPayload(userToAttempt)
          }
          resolve(payload);
        } else {
          reject(new BadRequestException(`Password don't match`));
        }
      });
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async getAllUsers() {
    return await this.userModel.find();
  }

  async validateUserByJwt(payload: JwtPayload) {
    let user = await this.findOneByEmail(payload.email);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  createJwtPayload(user) {
    let data: JwtPayload = {
      _id: user._id,
      email: user.email
    };
    return this.jwtService.sign(data);
  }

  async verifyTokenByEmail(token: String) {
    try {
      return await this.tokenVerifyEmailModel.findOne({ tokenVerifyEmail: token })
        .then((data) => {
          if (data) {
            return this.userModel.findByIdAndUpdate(
              { _id: data.userId },
              { emailVerified: true },
              { new: true }).then(() => {
                return true;
              });
          } else {
            return false;
          }
        });
    } catch (e) {
      return false;
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async validateOrCreateGoogleUser(profile: any): Promise<LoggedUserDto> {
    let user = await this.userModel.findOne({ googleId: profile.id });

    if (!user) {
      // Create new user
      user = new this.userModel({
        firstname: profile.displayName?.split(' ')[0] || profile.given_name || 'User',
        lastname: profile.displayName?.split(' ')[1] || profile.family_name || '',
        email: profile.emails?.[0]?.value || profile.email,
        googleId: profile.id,
        profileImage: profile.photos?.[0]?.value || null,
        emailVerified: true,
        role: 'user'
      });

      await user.save();

      // Create profile
      await this.profileModel.create({ user: user._id });
    }

    const payload: LoggedUserDto = {
      _id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: this.createJwtPayload(user)
    };

    return payload;
  }

  /**
   * Handle Facebook OAuth callback
   */
  async validateOrCreateFacebookUser(profile: any): Promise<LoggedUserDto> {
    let user = await this.userModel.findOne({ facebookId: profile.id });

    if (!user) {
      // Create new user
      user = new this.userModel({
        firstname: profile.displayName?.split(' ')[0] || 'User',
        lastname: profile.displayName?.split(' ')[1] || '',
        email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
        facebookId: profile.id,
        profileImage: profile.photos?.[0]?.value || null,
        emailVerified: true,
        role: 'user'
      });

      await user.save();

      // Create profile
      await this.profileModel.create({ user: user._id });
    }

    const payload: LoggedUserDto = {
      _id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: this.createJwtPayload(user)
    };

    return payload;
  }

}


