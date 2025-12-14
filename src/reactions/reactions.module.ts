import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './entities/reaction.entity';
import {
  Character,
  CharacterSchema,
} from 'src/characters/entities/character.entity';
import { ExceptionsModule } from 'src/common/exceptions/exceptions.module';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
  imports: [
    ExceptionsModule,
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
      { name: Character.name, schema: CharacterSchema },
    ]),
  ],
})
export class ReactionsModule {}
