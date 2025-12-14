import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ReactionsService } from '../reactions/reactions.service';
import { ReactionType } from 'src/common/enum';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reactionsService: ReactionsService,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto.username, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/reaction/:type/characters')
  async reactedCharacters(
    @Param('userId') userId: string,
    @Param('type') type: ReactionType,
  ) {
    return this.reactionsService.findByUserAndReaction(userId, type);
  }
}
