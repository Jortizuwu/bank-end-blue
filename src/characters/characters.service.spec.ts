import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';

import { CharactersService } from './characters.service';
import { ReactionsService } from '../reactions/reactions.service';
import { ExceptionsService } from '../common/exceptions/exceptions.service';
import { ReactionType, TargetType } from '../common/enum';

describe('CharactersService', () => {
  let service: CharactersService;

  const mockCharacterModel = {
    updateOne: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const mockReactionsService = {
    reactToCharacter: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockExceptionsService = {
    internalServerErrorException: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: getModelToken('Character'),
          useValue: mockCharacterModel,
        },
        {
          provide: ReactionsService,
          useValue: mockReactionsService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ExceptionsService,
          useValue: mockExceptionsService,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create character and register reaction', async () => {
    mockCharacterModel.updateOne.mockResolvedValue(undefined);
    mockReactionsService.reactToCharacter.mockResolvedValue(undefined);

    await service.createCharacter(
      {
        idExternalApi: '1',
        name: 'Pikachu',
        image: 'image.png',
        type: TargetType.POKEMON,
        reactionType: ReactionType.LIKE,
      },
      'user-id',
    );

    expect(mockCharacterModel.updateOne).toHaveBeenCalled();
    expect(mockReactionsService.reactToCharacter).toHaveBeenCalledWith(
      'user-id',
      'POKEMON_1',
      ReactionType.LIKE,
    );
  });

  it('should return most liked character', async () => {
    const character = { name: 'Batman', likesCount: 10 };

    mockCharacterModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(character),
      }),
    });

    const result = await service.getMostLikedCharacter();

    expect(result).toEqual(character);
    expect(mockCharacterModel.findOne).toHaveBeenCalled();
  });

  it('should return most disliked character', async () => {
    const character = { name: 'Joker', dislikesCount: 5 };

    mockCharacterModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(character),
      }),
    });

    const result = await service.getMostDislikedCharacter();

    expect(result).toEqual(character);
  });

  it('should return a random character (Pokemon)', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    mockHttpService.get.mockReturnValue(
      of({
        data: {
          id: 1,
          name: 'bulbasaur',
          sprites: { front_default: 'image.png' },
          types: [{ type: { name: 'grass' } }],
        },
      }),
    );

    const result = await service.getRandomCharacters();

    expect(result).toEqual({
      id: '1',
      name: 'bulbasaur',
      image: 'image.png',
      origin: TargetType.POKEMON,
      extra: {
        types: ['grass'],
      },
    });
  });
});
