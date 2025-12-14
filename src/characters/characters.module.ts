import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { Character, CharacterSchema } from './entities/character.entity';
import { ReactionsModule } from 'src/reactions/reactions.module';
import { AuthModule } from 'src/auth/auth.module';
import { ExceptionsModule } from 'src/common/exceptions/exceptions.module';

@Module({
  imports: [
    HttpModule,
    ReactionsModule,
    AuthModule,
    ExceptionsModule,
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
    ]),
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}
