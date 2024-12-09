import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../common/schemas/users.schema';
import { Expert, ExpertSchema } from 'src/common/schemas/experts.schema';
import { Interview, InterviewSchema } from 'src/common/schemas/interview.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Expert.name, schema: ExpertSchema },
    { name: Interview.name, schema: InterviewSchema },
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule]
})
export class UsersModule { }
