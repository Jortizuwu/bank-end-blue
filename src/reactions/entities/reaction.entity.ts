import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReactionType } from 'src/common/enum';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Reaction {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    enum: ReactionType,
  })
  reaction: ReactionType;

  @Prop({ required: true, index: true })
  custom_id: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
