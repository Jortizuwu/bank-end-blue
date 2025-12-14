import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Reaction, ReactionDocument } from './entities/reaction.entity';
import { ReactionType, TargetType } from 'src/common/enum';
import { CharactersService } from 'src/characters/characters.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,
    private readonly charactersService: CharactersService,
  ) {}

  async react(
    userId: string,
    targetId: string,
    targetType: TargetType,
    reactionType: ReactionType,
  ) {
    const existing = await this.reactionModel.findOne({
      userId,
      targetId,
      targetType,
    });

    if (!existing) {
      await this.reactionModel.create({
        userId,
        targetId,
        targetType,
        reaction: reactionType,
      });

      // reactionType === ReactionType.LIKE
      //   ? await this.charactersService.incrementLike(targetId, targetType)
      //   : await this.charactersService.incrementDislike(targetId, targetType);

      return { reaction: reactionType };
    }

    if (existing.reaction === reactionType) {
      throw new ConflictException('Reaction already exists');
    }

    if (reactionType === ReactionType.LIKE) {
      await this.charactersService.incrementLike(targetId, targetType);
    } else {
      await this.charactersService.incrementDislike(targetId, targetType);
    }

    existing.reaction = reactionType;
    await existing.save();

    return { reaction: reactionType };
  }
}
