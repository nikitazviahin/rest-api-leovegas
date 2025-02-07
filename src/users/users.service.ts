import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { ObjectId } from '../common/types/object-id.type';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async updateUserById(
    userId: ObjectId,
    updateUserData: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    return this.userModel.findOne({ email });
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return this.userModel.findOne({ _id: id });
  }
}
