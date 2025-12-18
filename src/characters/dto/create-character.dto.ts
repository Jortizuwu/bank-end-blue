import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReactionType, TargetType } from '../../common/enum';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  idExternalApi: string;

  @IsString()
  @IsNotEmpty()
  type: TargetType;

  @IsEnum(ReactionType)
  reactionType: ReactionType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}
