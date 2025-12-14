import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
// import { ValidationPipe } from 'src/common/pipes/validation.pipe';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('random')
  findAll() {
    return this.charactersService.getRandomCharacters();
  }

  @Post('create')
  async create(@Body(new ValidationPipe()) body: CreateCharacterDto) {
    return this.charactersService.createCharacter(body);
  }
}
