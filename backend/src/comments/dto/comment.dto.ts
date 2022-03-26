import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {

  @IsString()
  @ApiProperty()
  content: string;

  @IsString()
  @ApiProperty()
  likes: number;

  @IsString()
  @ApiProperty()
  articleId: string;

  @IsString()
  @ApiProperty()
  authorId: string;

}