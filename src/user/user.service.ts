// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async create(username: string, password: string) {
    try {
      const exists = await this.userModel.exists({ username });
      if (exists) throw new ConflictException('User already exists');

      const hashed = await bcrypt.hash(password, 10);

      return this.userModel.create({
        username,
        password: hashed,
      });
    } catch {
      this.exceptionsService.internalServerErrorException({
        message: 'Error creating user',
      });
    }
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }
}
