import { IsEnum, IsString } from 'class-validator';
import { TargetType } from '../../common/enum';

export class CreateReactionDto {
  @IsString()
  targetId: string;

  @IsEnum(TargetType)
  targetType: TargetType;
}
