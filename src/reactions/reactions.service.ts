import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionDocument } from './entities/reaction.entity';
import {
  Character,
  CharacterDocument,
} from 'src/characters/entities/character.entity';
import { Model } from 'mongoose';
import { ReactionType } from 'src/common/enum';
import { Injectable } from '@nestjs/common';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,

    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async reactToCharacter(
    userId: string,
    characterCustomId: string,
    reaction: ReactionType,
  ) {
    try {
      const character = await this.characterModel.findOne({
        custom_id: characterCustomId,
      });

      if (!character) {
        throw new Error('Character does not exist');
      }

      const result = await this.reactionModel.updateOne(
        { userId, custom_id: characterCustomId },
        {
          $setOnInsert: {
            userId,
            custom_id: characterCustomId,
            reaction,
          },
        },
        { upsert: true },
      );

      if (result.upsertedCount === 0) {
        return;
      }

      await this.characterModel.updateOne(
        { custom_id: characterCustomId },
        {
          $inc:
            reaction === ReactionType.LIKE
              ? { likesCount: 1 }
              : { dislikesCount: 1 },
        },
      );
    } catch (error) {
      this.exceptionsService.internalServerErrorException({
        message:
          error instanceof Error ? error.message : 'internal server error',
      });
    }
  }

  async findByUserAndReaction(userId: string, reaction: ReactionType) {
    try {
      const reactions = await this.reactionModel.find({ userId, reaction });

      if (!reactions) throw new Error('Reactions not found');

      return reactions;
    } catch (error) {
      if (error instanceof Error) {
        this.exceptionsService.internalServerErrorException({
          message: error.message,
        });
        return;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'internal server error',
      });
    }
  }

  async getLastReactedCharacter() {
    try {
      const reaction = await this.reactionModel
        .findOne({ createdAt: { $exists: true } })
        .sort({ createdAt: -1 })
        .exec();

      if (!reaction) throw new Error('No reactions found');

      return reaction;
    } catch (error) {
      if (error instanceof Error) {
        this.exceptionsService.internalServerErrorException({
          message: error.message,
        });
        return null;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'internal server error',
      });
    }
  }
}
