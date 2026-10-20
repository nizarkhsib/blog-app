import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { HelloController } from './hello.controller';
import * as winston from 'winston';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get('MONGODB_URI') ||
          `mongodb://127.0.0.1:27017/${configService.get('DB_NAME')}`,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    ArticlesModule,
    CommentsModule,
    ProfileModule,
    NotificationsModule
  ],
  controllers: [HelloController],
  providers: [],
})

export class AppModule {
  static port: number | string;
  constructor(private _configService: ConfigService) {
    AppModule.port = this._configService.get('PORT');
  }
}
