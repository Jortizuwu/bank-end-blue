import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateReactionDto } from './dto/create-reaction.dto';
import { Reaction, ReactionDocument } from './entities/reaction.entity';
import { ReactionType } from 'src/common/enum';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,
  ) {}

  async like(createReactionDto: CreateReactionDto) {
    const { targetId, targetType } = createReactionDto;

    const existingReaction = await this.reactionModel.findOne({
      targetId,
      targetType,
    });

    if (existingReaction) {
      if (existingReaction.reaction === ReactionType.LIKE) {
        throw new ConflictException('Already liked');
      }

      existingReaction.reaction = ReactionType.LIKE;
      return existingReaction.save();
    }

    return this.reactionModel.create({
      targetId,
      targetType,
      reaction: ReactionType.LIKE,
    });
  }

  async unlike(createReactionDto: CreateReactionDto) {
    const { targetId, targetType } = createReactionDto;

    const existingReaction = await this.reactionModel.findOne({
      targetId,
      targetType,
    });

    if (!existingReaction) {
      throw new NotFoundException('Reaction not found');
    }

    if (existingReaction.reaction === ReactionType.UNLIKE) {
      throw new ConflictException('Already unliked');
    }

    existingReaction.reaction = ReactionType.UNLIKE;
    return existingReaction.save();
  }
}
