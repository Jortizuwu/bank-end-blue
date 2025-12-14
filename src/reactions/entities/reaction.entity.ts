import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TargetType, ReactionType } from 'src/common/enum';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Reaction {
  @Prop({
    required: true,
  })
  userId: string;

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
    enum: TargetType,
  })
  targetType: TargetType;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

ReactionSchema.index(
  { userId: 1, targetId: 1, targetType: 1 },
  { unique: true },
);
