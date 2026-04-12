import { IsString, IsEmail, IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  content?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  chapters?: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
  }>;

  @IsEnum(['draft', 'published'])
  @IsOptional()
  @ApiProperty()
  status?: 'draft' | 'published';

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  archived?: boolean;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  tags?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  coverImage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  coverImageContentType?: string;
}