import { ReactionsService } from './../reactions/reactions.service';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Character, CharacterDocument } from './entities/character.entity';
import { CharacterDto } from './dto/character.dto';
import { EXTERNAL_API } from 'src/common/apis/external-api';
import { GetPokemonResponse } from 'src/common/interfaces/pokeapi.response';
import { HerosResponse } from 'src/common/interfaces/heros.response';
import { RickAndMortyResponse } from 'src/common/interfaces/rickandmorty.response';
import { ReactionType, TargetType } from 'src/common/enum';
import { CreateCharacterDto } from './dto/create-character.dto';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { AnimeResponse } from 'src/common/interfaces/anime.response';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
    private readonly reactionsService: ReactionsService,
    private readonly httpService: HttpService,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async createCharacter(
    body: CreateCharacterDto,
    userId: string,
  ): Promise<void> {
    const customId = `${body.type}_${body.idExternalApi}`;

    try {
      await this.characterModel.updateOne(
        { custom_id: customId },
        {
          $setOnInsert: {
            type: body.type,
            idExternalApi: body.idExternalApi,
            custom_id: customId,
            name: body.name,
            image: body.image,
          },
        },
        { upsert: true },
      );

      await this.reactionsService.reactToCharacter(
        userId,
        customId,
        body.reactionType,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while reacting to character',
      });
    }
  }

  async getMostLikedCharacter() {
    try {
      const character = await this.characterModel
        .findOne()
        .sort({ likesCount: -1 })
        .exec();

      if (!character) {
        throw new NotFoundException('No characters found');
      }

      return character;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while reacting to character',
      });
    }
  }

  async getMostDislikedCharacter() {
    try {
      const character = await this.characterModel
        .findOne()
        .sort({ dislikesCount: -1 })
        .exec();

      if (!character) {
        throw new NotFoundException('No characters found');
      }

      return character;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while reacting to character',
      });
    }
  }

  async findCharacterByName(name: string) {
    try {
      const character = await this.characterModel
        .findOne({
          name,
        })
        .exec();

      if (!character) {
        throw new NotFoundException('No characters found');
      }

      return character;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while reacting to character',
      });
    }
  }

  async getRandomCharacters(): Promise<CharacterDto> {
    try {
      const random = Math.floor(Math.random() * 4);

      switch (random) {
        case 0:
          return await this.getRandomPokemons();
        case 1:
          return await this.getRandomRickAndMorty();
        case 2:
          return await this.getRandomSuperHeroes();
        case 3:
        default:
          return await this.getRandomAnime();
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async getRandomPokemons(): Promise<CharacterDto> {
    const id = Math.floor(Math.random() * 1010) + 1;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<GetPokemonResponse>(
          `${EXTERNAL_API.POKEMON}/${id}`,
        ),
      );

      return {
        id: String(data.id),
        name: data.name,
        image: data.sprites.front_default,
        origin: TargetType.POKEMON,
        extra: {
          types: data.types.map((t) => t.type.name),
        },
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async getRandomRickAndMorty(): Promise<CharacterDto> {
    const id = Math.floor(Math.random() * 826) + 1;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<RickAndMortyResponse>(
          `${EXTERNAL_API.RICK_AND_MORTY}/${id}`,
        ),
      );

      const response: CharacterDto = {
        id: String(data.id),
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
  }

  private async getRandomSuperHeroes(): Promise<CharacterDto> {
    const id = Math.floor(Math.random() * 731) + 1;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<HerosResponse>(
          `${EXTERNAL_API.SUPER_HEROES}/${process.env.HERO_TOKEN}/${id}`,
        ),
      );

      const response: CharacterDto = {
        id: String(data.id),
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
  }

  private async getRandomAnime(): Promise<CharacterDto> {
    try {
      const {
        data: { data },
      } = await firstValueFrom(
        this.httpService.get<AnimeResponse>(`${EXTERNAL_API.ANIME}`),
      );

      return {
        id: String(data.mal_id),
        name: data.name,
        image: data.images.webp.image_url,
        origin: TargetType.ANIME,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  incrementDislikeOrLike(custom_id: string, reaction: ReactionType) {
    return this.characterModel.findOneAndUpdate(
      { custom_id },
      {
        $inc:
          reaction === ReactionType.LIKE
            ? { likesCount: 1 }
            : { dislikesCount: 1 },
      },
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
