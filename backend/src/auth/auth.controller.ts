import { Controller, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from "./user.model";
import { RegisterDto } from './dto/register.dto';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @ApiOperation({ summary: 'getAllUsers' })
  @Get('/getAllUsers')
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  @ApiOperation({ summary: 'signIn' })
  @Post('/signIn')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.validateUserByPassword(authCredentialsDto);
  }

  @ApiOperation({ summary: 'signUp' })
  @Post('/signUp')
  async signUp(@Body() authCredentialsDto: RegisterDto) {
    return await this.authService.createUser(authCredentialsDto);
  }

  @ApiOperation({ summary: 'verifyTokenByEmail' })
  @Get('/verify/:token')
  async verifyTokenByEmail(@Param('token') token: string) {
    return await this.authService.verifyTokenByEmail(token);
  }

  /**
   * Google OAuth login (disabled)
   */
  @ApiOperation({ summary: 'Google OAuth (disabled)' })
  @Get('/google')
  async googleAuth() {
    return { message: 'Google OAuth is currently disabled' };
  }

  /**
   * Google OAuth callback (disabled)
   */
  @Get('/google/callback')
  googleAuthRedirect(@Req() req, @Res() res) {
    return res.status(404).json({ message: 'Google OAuth is currently disabled' });
  }

  /**
   * Facebook OAuth login
   */
  @ApiOperation({ summary: 'Facebook OAuth' })
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    // Guard redirects to Facebook
  }

  /**
   * Facebook OAuth callback
   */
  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req, @Res() res) {
    const { user } = req;
    // Redirect to frontend with token
    const token = user.token;
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  }

}
