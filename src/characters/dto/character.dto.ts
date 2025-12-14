export class CharacterDto {
  id: number | string;
  name: string;
  image: string;
  origin: 'POKEMON' | 'RICK_AND_MORTY' | 'SUPER_HERO';
  extra?: Record<string, any>;
}
