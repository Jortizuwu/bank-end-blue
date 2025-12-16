import * as bcrypt from 'bcrypt';
import {
  Injectable,
  ConflictException,
  BadRequestException,
  HttpException,
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

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        username,
        password: hashedPassword,
      });
      await newUser.save();

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while reacting to character',
      });
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userModel.findOne({ username });

      if (!user) throw new BadRequestException('User not found');

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.exceptionsService.internalServerErrorException({
        message: 'Unexpected error while reacting to character',
      });
    }
  }
}
