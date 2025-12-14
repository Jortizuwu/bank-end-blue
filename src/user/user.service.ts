// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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

      await bcrypt.hash(password, 10);

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        this.exceptionsService.badRequestException({
          message: error.message,
        });
        return;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'internal server error',
      });
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userModel.findOne({ username });

      if (!user) throw new BadRequestException('User not found');

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.exceptionsService.badRequestException({
          message: error.message,
        });
        return;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'internal server error',
      });
    }
  }
}
