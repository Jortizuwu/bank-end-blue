import { TargetType } from 'src/common/enum';

export class CharacterDto {
  id: number | string;
  name: string;
  image: string;
  origin: TargetType;
  extra?: Record<string, any>;
}
