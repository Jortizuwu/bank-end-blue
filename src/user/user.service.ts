// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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
    } catch (error) {
      console.log(error);
    }
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }
}
