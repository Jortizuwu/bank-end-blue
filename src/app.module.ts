import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfiguration } from './common/config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB || 'mongodb://localhost:27017/prueba-db',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
