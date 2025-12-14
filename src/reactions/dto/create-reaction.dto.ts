import { IsEnum, IsString } from 'class-validator';
import { TargetType } from 'src/common/enum';

export class CreateReactionDto {
  @IsString()
  targetId: string;

  @IsEnum(TargetType)
  targetType: TargetType;
}
