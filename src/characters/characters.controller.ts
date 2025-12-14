/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('random')
  findAll() {
    return this.charactersService.getRandomCharacters();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body(new ValidationPipe()) body: CreateCharacterDto,
    @Req() req,
  ) {
    return this.charactersService.createCharacter(body, req.user.sub as string);
  }
}
