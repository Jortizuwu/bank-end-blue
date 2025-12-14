import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvConfiguration } from './common/config/env.config';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB || 'mongodb://localhost:27017/prueba-db',
    ),
    CharactersModule,
  ],
})
export class AppModule {}
