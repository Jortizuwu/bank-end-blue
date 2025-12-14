import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionsModule } from 'src/reactions/reactions.module';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { ExceptionsModule } from 'src/common/exceptions/exceptions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ReactionsModule,
    ExceptionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
