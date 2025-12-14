import { IsEnum, IsString } from 'class-validator';
import { ReactionTargetType } from 'src/common/enum';

export class CreateReactionDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  targetId: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(ReactionTargetType)
  targetType: ReactionTargetType;
}
