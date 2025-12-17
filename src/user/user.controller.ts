/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ReactionsService } from '../reactions/reactions.service';
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
  @Get('reaction/characters')
  async reactedCharacters(@Req() req) {
    return this.reactionsService.listReactionsByUserId(req.user.sub as string);
  }
}
