import { Body, Controller, Get, Post } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('random')
  findAll() {
    return this.charactersService.getRandomCharacters();
  }

  @Post('create')
  Post(@Body() body: CreateCharacterDto) {
    return this.charactersService.createCharacter(body);
  }
}
