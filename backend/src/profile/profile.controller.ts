import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationParams } from 'src/pagination-params';
import { ProfileService } from './profile.service';
import { memoryStorage } from 'multer';
import { imageFileFilter } from 'src/core/middleware/file-management.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { Profile } from './profile.model';
import { ProfileDto } from './dto/profile.dto';
import { Request, Response } from 'express';

@Controller('Profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @ApiOperation({ summary: 'getPaginatedProfile' })
  @Get()
  async getPaginatedProfile(@Query() { skip, limit }: PaginationParams) {
    return this.profileService.findAll(Number(skip), Number(limit));
  }

  @ApiOperation({ summary: 'Get profile stats (articles, followers, following)' })
  @Get(':userId/stats')
  async getProfileStats(@Param('userId') userId: string) {
    return this.profileService.getProfileStats(userId);
  }

  @ApiOperation({ summary: 'Check if a user is following another user' })
  @Get(':userId/isFollowing/:targetUserId')
  async isFollowing(@Param('userId') userId: string, @Param('targetUserId') targetUserId: string) {
    return this.profileService.isFollowing(userId, targetUserId);
  }

  @ApiOperation({ summary: 'Get list of followers for a user' })
  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return this.profileService.getFollowers(userId);
  }

  @ApiOperation({ summary: 'Get list of users a user is following' })
  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return this.profileService.getFollowing(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @Post(':userId/follow')
  async followUser(@Param('userId') userId: string, @Req() req: Request) {
    const authUser = req.user['user'] || req.user;
    const loggedInUserId = authUser['id'] || authUser['_id'];
    return this.profileService.followUser(loggedInUserId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @Post(':userId/unfollow')
  async unfollowUser(@Param('userId') userId: string, @Req() req: Request) {
    const authUser = req.user['user'] || req.user;
    const loggedInUserId = authUser['id'] || authUser['_id'];
    return this.profileService.unfollowUser(loggedInUserId, userId);
  }

  @ApiOperation({ summary: 'getProfileByUserId' })
  @Get(':id/photo')
  async getProfilePhoto(@Param('id') profileId: string, @Res() res: Response) {
    const photo = await this.profileService.getProfilePhoto(profileId);
    if (!photo?.data) {
      return res.status(404).send('No photo found');
    }
    res.setHeader('Content-Type', photo.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(photo.data);
  }

  @ApiOperation({ summary: 'getProfileByUserId' })
  @Get(':id')
  getProfile(@Param('id') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'updateProfile' })
  async updateProfile(
    @Param('id') profileId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() profileDto: ProfileDto): Promise<Profile> {
    return await this.profileService.updateProfile(profileId, file, profileDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'deleteProfile' })
  @Delete(':id')
  async deleteProfile(@Param('id') ProfileId: string) {
    await this.profileService.deleteProfile(ProfileId);
    return null;
  }

}