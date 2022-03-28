import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationParams } from 'src/pagination-params';
import { ProfileService } from './profile.service';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/core/middleware/file-management.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { Profile } from './profile.model';
import { ProfileDto } from './dto/profile.dto';

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
    return this.profileService.getProfileByUserId(userId);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'updateProfile' })
  async updateProfile(
    @Param('id') profileId: string,
    @UploadedFile() file,
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