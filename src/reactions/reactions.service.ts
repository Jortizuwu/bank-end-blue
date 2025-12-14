import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionDocument } from './entities/reaction.entity';
import {
  Character,
  CharacterDocument,
} from 'src/characters/entities/character.entity';
import { Model } from 'mongoose';
import { ReactionType } from 'src/common/enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,

    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
  ) {}

  async reactToCharacter(
    userId: string,
    characterCustomId: string,
    reaction: ReactionType,
  ) {
    const character = await this.characterModel.findOne({
      custom_id: characterCustomId,
    });

    // const reactionExists = await this.reactionModel.findOne({
    //   userId,
    //   custom_id: characterCustomId,
    // });

    if (!character) {
      throw new Error('Character does not exist');
    }

    await this.reactionModel.create({
      userId,
      reaction,
      custom_id: characterCustomId,
    });

    await this.characterModel.updateOne(
      { custom_id: characterCustomId },
      {
        $inc:
          reaction === ReactionType.LIKE
            ? { likesCount: 1 }
            : { dislikesCount: 1 },
      },
    );
  }

  async findByUserAndReaction(userId: string, reaction: ReactionType) {
    return this.reactionModel.find({ userId, reaction });
  }
}
