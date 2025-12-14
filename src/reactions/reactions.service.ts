import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Reaction, ReactionDocument } from './entities/reaction.entity';
import { ReactionType } from 'src/common/enum';
import { CharactersService } from 'src/characters/characters.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,
    private readonly charactersService: CharactersService,
  ) {}

  async reactToCharacter(
    userId: string,
    characterCustomId: string,
    reaction: ReactionType,
  ) {
    try {
      await this.reactionModel.create({
        userId,
        reaction,
        custom_id: characterCustomId,
      });

      await this.charactersService.incrementDislikeOrLike(
        characterCustomId,
        reaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async findByUserAndReaction(userId: string, reaction: ReactionType) {
    return this.reactionModel.find({
      userId,
      reaction,
    });
  }
}
