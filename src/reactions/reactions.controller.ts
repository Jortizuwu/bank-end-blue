import { Controller, Get } from '@nestjs/common';
import { ReactionsService } from './reactions.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get('last-reacted')
  async getLastReacted() {
    return this.reactionsService.getLastReactedCharacter();
  }
}
