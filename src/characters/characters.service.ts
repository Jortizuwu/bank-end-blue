import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Character, CharacterDocument } from './entities/character.entity';
import { CharacterDto } from './dto/character.dto';
import { EXTERNAL_API } from 'src/common/apis/external-api';
import { GetPokemonResponse } from 'src/common/interfaces/pokeapi.response';
import { HerosResponse } from 'src/common/interfaces/heros.response';
import { RickAndMortyResponse } from 'src/common/interfaces/rickandmorty.response';
import { ReactionType, TargetType } from 'src/common/enum';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
    private readonly httpService: HttpService,
  ) {}

  async createCharacter(body: CreateCharacterDto): Promise<void> {
    const character = await this.characterModel.findOne({
      custom_id: body.custom_id,
    });

    if (character) {
      if (body.reactionType === ReactionType.LIKE) {
        await this.incrementLike(body.custom_id, body.type);
        return;
      }

      await this.incrementDislike(body.custom_id, body.type);
      return;
    }

    await this.characterModel.create({
      type: body.type,
      idExternalApi: body.idExternalApi,
      custom_id: `${body.type}_${body.idExternalApi}`,
    });
  }

  async getRandomCharacters(): Promise<CharacterDto[]> {
    try {
      const pokemons = this.getRandomPokemons(10);
      const rickAndMorty = this.getRandomRickAndMorty(10);
      const superHeroes = this.getRandomSuperHeroes(10);

      const results = await Promise.all([
        ...pokemons,
        ...rickAndMorty,
        ...superHeroes,
      ]);

      return results.sort(() => Math.random() - 0.5);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private getRandomPokemons(amount: number) {
    return Array.from({ length: amount }).map(async () => {
      const id = Math.floor(Math.random() * 1010) + 1;

      try {
        const { data } = await firstValueFrom(
          this.httpService.get<GetPokemonResponse>(
            `${EXTERNAL_API.POKEMON}/${id}`,
          ),
        );

        const response: CharacterDto = {
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          origin: TargetType.POKEMON,
          extra: {
            types: data.types.map((t) => t.type.name),
          },
        };

        return response;
      } catch (error) {
        this.handleExceptions(error);
      }
    });
  }

  private getRandomRickAndMorty(amount: number) {
    return Array.from({ length: amount }).map(async () => {
      const id = Math.floor(Math.random() * 826) + 1;

      try {
        const { data } = await firstValueFrom(
          this.httpService.get<RickAndMortyResponse>(
            `${EXTERNAL_API.RICK_AND_MORTY}/${id}`,
          ),
        );

        const response: CharacterDto = {
          id: data.id,
          name: data.name,
          image: data.image,
          origin: TargetType.RICK_AND_MORTY,
          extra: {
            species: data.species,
            status: data.status,
          },
        };

        return response;
      } catch (error) {
        this.handleExceptions(error);
      }
    });
  }

  private getRandomSuperHeroes(amount: number) {
    return Array.from({ length: amount }).map(async () => {
      const id = Math.floor(Math.random() * 731) + 1;
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<HerosResponse>(
            `${EXTERNAL_API.SUPER_HEROES}/${process.env.HERO_TOKEN}/${id}`,
          ),
        );

        const response: CharacterDto = {
          id: data.id,
          name: data.name,
          image: data.image.url,
          origin: TargetType.SUPER_HERO,
          extra: {
            powerstats: data.powerstats.power,
          },
        };

        return response;
      } catch (error) {
        this.handleExceptions(error);
      }
    });
  }

  incrementLike(targetId: string, type: TargetType) {
    return this.characterModel.findOneAndUpdate(
      { targetId, type },
      { $inc: { likes: 1 } },
      { upsert: true },
    );
  }

  incrementDislike(targetId: string, type: TargetType) {
    return this.characterModel.findOneAndUpdate(
      { targetId, type },
      { $inc: { dislikes: 1 } },
      { upsert: true },
    );
  }

  private handleExceptions(error: unknown): never {
    if (error instanceof AxiosError) {
      throw new BadRequestException(error.response?.data ?? error.message);
    }

    throw new InternalServerErrorException('Error fetching Pokemon');
  }
}
