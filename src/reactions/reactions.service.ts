import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionDocument } from './entities/reaction.entity';
import {
  Character,
  CharacterDocument,
} from '../characters/entities/character.entity';
import { Model } from 'mongoose';
import { ReactionType } from '../common/enum';
import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExceptionsService } from '../common/exceptions/exceptions.service';

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
        throw new ConflictException('Reaction already exists by user');
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
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while reacting to character',
      });
    }
  }

  async listReactionsByUserId(userId: string) {
    try {
      const reactions = await this.reactionModel.aggregate([
        {
          $match: {
            userId,
          },
        },
        {
          $lookup: {
            from: 'characters',
            localField: 'custom_id',
            foreignField: 'custom_id',
            as: 'character',
          },
        },
        {
          $unwind: '$character',
        },
      ]);

      if (reactions.length === 0) {
        throw new NotFoundException('Reactions not found');
      }

      return reactions as Character[];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while fetching reactions',
      });
    }
  }

  async getLastReactedCharacter() {
    try {
      const reaction = await this.reactionModel
        .findOne()
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      if (!reaction) {
        throw new NotFoundException('No reactions found');
      }

      const character = await this.characterModel
        .findOne({ custom_id: reaction.custom_id })
        .lean()
        .exec();

      if (!character) {
        throw new NotFoundException(
          `Character with custom_id ${reaction.custom_id} not found`,
        );
      }

      return {
        _id: reaction._id,
        custom_id: character.custom_id,
        idExternalApi: character.idExternalApi,
        type: character.type,
        name: character.name,
        image: character.image,
        reactionType: reaction.reaction,
        dislikesCount: character.dislikesCount,
        likesCount: character.likesCount,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while getting last reacted character',
      });
    }
  }
}
