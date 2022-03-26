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

  @ApiOperation({ summary: 'getProfile' })
  @Get(':id')
  async getProfileByArticleId(
    @Param('id') articleId: string,
    @Query() { skip, limit }: PaginationParams) {
    return await this.profileService.getProfileByArticleId(articleId, Number(skip), Number(limit));
  }

  @ApiOperation({ summary: 'getPaginatedProfile' })
  @Get()
  async getPaginatedProfile(@Query() { skip, limit }: PaginationParams) {
    return this.profileService.findAll(Number(skip), Number(limit));
  }

  @ApiOperation({ summary: 'getProfileById' })
  @Get(':id')
  getProfile(@Param('id') ProfileId: string) {
    return this.profileService.getProfileById(ProfileId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'updateCategory' })
  @Put(':id')
  async updateCategory(@Param('id') ProfileId: string, @Body() category: Profile): Promise<Profile> {
    return this.profileService.updateProfile(ProfileId, category);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'deleteProfile' })
  @Delete(':id')
  async deleteProfile(@Param('id') ProfileId: string) {
    await this.profileService.deleteProfile(ProfileId);
    return null;
  }
}
