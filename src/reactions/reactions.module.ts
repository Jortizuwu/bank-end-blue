import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CharactersModule } from 'src/characters/characters.module';
import { Reaction, ReactionSchema } from './entities/reaction.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    CharactersModule,
    HttpModule,
  ],
})
export class ReactionsModule {}
