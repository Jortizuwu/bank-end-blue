import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TargetType } from 'src/common/enum';

export type CharacterDocument = HydratedDocument<Character>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Character {
  @Prop({
    required: true,
    enum: TargetType,
    index: true,
  })
  type: TargetType;

  @Prop({
    default: 0,
    min: 0,
  })
  likes: number;

  @Prop({
    default: 0,
    min: 0,
  })
  dislikes: number;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
