import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReactionTargetType, ReactionType } from 'src/common/enum';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Reaction {
  @Prop({
    required: true,
    enum: ReactionType,
  })
  reaction: ReactionType;

  @Prop({
    required: true,
  })
  targetId: string;

  @Prop({
    required: true,
    enum: ReactionTargetType,
  })
  targetType: ReactionTargetType;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
