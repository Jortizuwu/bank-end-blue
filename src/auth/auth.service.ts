import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();

    const payload = {
      sub: user._id,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
