import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable, of } from 'rxjs';
import { PaginationParams } from 'src/pagination-params';
import { ProfileService } from './profile.service';
import { Profile } from 'passport';

@UseGuards(AuthGuard('jwt'))
@Controller('Profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @ApiOperation({ summary: 'getPaginatedProfile' })
  @Get()
  async getPaginatedProfile(@Query() { skip, limit }: PaginationParams) {
    return this.profileService.findAll(Number(skip), Number(limit));
  }

  @ApiOperation({ summary: 'getProfileByUserId' })
  @Get(':id')
  getProfile(@Param('id') userId: string) {
    console.log('userId', userId);
    return this.profileService.getProfileByUserId(userId);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ summary: 'updateCategory' })
  // @Put(':id')
  // async updateCategory(@Param('id') ProfileId: string, @Body() category: Profile): Promise<Profile> {
  //   return this.profileService.updateProfile(ProfileId, category);
  // }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'deleteProfile' })
  @Delete(':id')
  async deleteProfile(@Param('id') ProfileId: string) {
    await this.profileService.deleteProfile(ProfileId);
    return null;
  }
}
