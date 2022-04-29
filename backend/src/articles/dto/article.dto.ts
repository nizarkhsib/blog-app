import { IsString, IsEmail, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @IsString()
  @ApiProperty()
  title: string;

  // @IsString()
  // @ApiProperty()
  // description: string;

  @IsString()
  @ApiProperty()
  content: string;

  // @IsDate()
  // @ApiProperty()
  // datePublished: string;

  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  tags: string[];

  // For Image
  filePath?: string;
}