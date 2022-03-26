import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenVerifyEmail, User, UserSchema, } from './user.model';
import { v1 as uuidv1 } from 'uuid';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { RegisterDto } from './dto/register.dto';
import { LoggedUserDto } from './dto/logged-user.dto';
import * as mongoose from 'mongoose';
import { Profile, ProfileSchema } from 'src/profile/profile.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('TokenVerifyEmail') private tokenVerifyEmailModel: Model<TokenVerifyEmail>,
    @InjectModel('Profile') private profileModel: Model<Profile>,
    private jwtService: JwtService,
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) { }

  async createUser(authCredentialsDto: RegisterDto) {
    let userToAttempt = await this.findOneByEmail(authCredentialsDto.email);

    if (!userToAttempt) {
      const session = await this.userModel.startSession();

      const newUser = new this.userModel({
        firstname: authCredentialsDto.firstname,
        lastname: authCredentialsDto.lastname,
        email: authCredentialsDto.email,
        password: authCredentialsDto.password,
      });

      const createWithTransaction = await session.withTransaction(async () => {
        let newProfile;
        const createdUser = await this.userModel
          .create([newUser], { session: session });

        newProfile = await this.profileModel.create(
          [{ user: createdUser._id }],
          { session: session });

        const newTokenVerifyEmail = await new this.tokenVerifyEmailModel.create(
          [{
            userId: createdUser._id,
            tokenVerifyEmail: uuidv1()
          }],
          { session: session }
        );
        //     this.sendEmailMiddleware.sendEmail(user.email, newTokenVerifyEmail.tokenVerifyEmail, []);

        return await Promise.all([createdUser, newProfile]);
      });

      if (!createWithTransaction) {
        await session.abortTransaction();
        session.endSession();
      }
    } else {
      throw new BadRequestException('Email already exists !');
    }
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
      console.log('error', e);
    }
  }

}

