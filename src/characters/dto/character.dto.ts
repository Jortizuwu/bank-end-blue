import { ReactionTargetType } from 'src/common/enum';

export class CharacterDto {
  id: number | string;
  name: string;
  image: string;
  origin: ReactionTargetType;
  extra?: Record<string, any>;
}
