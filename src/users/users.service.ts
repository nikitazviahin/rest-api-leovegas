import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    return this.userModel.findOne({ email });
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return this.userModel.findOne({ id });
  }
}
