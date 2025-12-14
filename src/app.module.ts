import { ConfigModule } from '@nestjs/config';
import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvConfiguration } from './common/config/env.config';
import { CharactersModule } from './characters/characters.module';
import { ReactionsModule } from './reactions/reactions.module';
import { APP_PIPE } from '@nestjs/core';
// import { ValidationPipe } from './common/pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB ||
        'mongodb://root:example@localhost:27017/?authSource=admin',
    ),
    CharactersModule,
    ReactionsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
