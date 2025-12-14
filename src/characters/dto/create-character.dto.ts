/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReactionType, TargetType } from 'src/common/enum';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  custom_id: string;

  @IsString()
  @IsNotEmpty()
  idExternalApi: string;

  @IsString()
  @IsNotEmpty()
  type: TargetType;

  @IsEnum(TargetType)
  reactionType: ReactionType;
}
