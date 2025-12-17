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
    index: true,
  })
  custom_id: string;

  @Prop({
    required: true,
  })
  idExternalApi: string;

  @Prop({
    required: true,
    enum: TargetType,
    index: true,
  })
  type: TargetType;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  image: string;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  dislikesCount: number;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
