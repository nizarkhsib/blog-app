import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSchema } from './product.model';
import { MulterModule } from '@nestjs/platform-express';
import { AppLogger } from '../core/services/logger.service';

@Module({
  imports: [
    MulterModule.register({
      dest: '/tmp',
    }),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }])
  ],
  controllers: [ProductsController],
  providers: [ProductsService, AppLogger],
})
export class ProductsModule { }
