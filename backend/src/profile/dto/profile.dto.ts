import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {

  @IsString()
  @ApiProperty()
  firstname: string;

  @IsString()
  @ApiProperty()
  lastname: string;

  @IsString()
  @ApiProperty()
  email: string;

  // For Image
  filePath?: string;

}