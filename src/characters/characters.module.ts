import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';

@Module({
  imports: [HttpModule],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
