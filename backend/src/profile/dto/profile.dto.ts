import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  email: string;


  @IsString()
  @ApiProperty()
  userId: string;

  // For Image
  filePath?: string;

}