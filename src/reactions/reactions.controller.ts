import { Controller, Post, Body } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}
  // @Post('like')
  // like(@Body() dto: CreateReactionDto) {
  //   return this.reactionsService.like(dto);
  // }

  // @Post('unlike')
  // unlike(@Body() dto: CreateReactionDto) {
  //   return this.reactionsService.unlike(dto);
  // }
}
