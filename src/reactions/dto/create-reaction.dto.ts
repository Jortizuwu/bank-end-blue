import { IsEnum, IsString } from 'class-validator';
import { TargetType } from 'src/common/enum';

export class CreateReactionDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  targetId: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(TargetType)
  targetType: TargetType;
}
