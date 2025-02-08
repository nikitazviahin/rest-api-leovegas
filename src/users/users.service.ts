import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { JsonApiGetUserDetailsDto, UserDto } from './dtos/user.dto';
import { ObjectId } from '../common/types/object-id.type';
import { JsonApiErrorResponseDto } from '../common/dtos/json-api-error.dto';

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

  async getUserDetails(
    userId: string,
    requestUser: UserDto,
  ): Promise<JsonApiGetUserDetailsDto | JsonApiErrorResponseDto> {
    const user = await this.userModel.findById(userId).select('-password');

    if (user._id !== requestUser._id) {
      return {
        errors: [
          {
            status: '403',
            title: 'Forbidden',
            detail: 'No permission to get the resource',
          },
        ],
      };
    }

    if (!user) {
      return {
        errors: [
          {
            status: '404',
            title: 'Not Found',
            detail: 'User not found',
          },
        ],
      };
    }

    return {
      data: {
        type: 'users',
        id: user._id.toString(),
        attributes: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          access_token: user.access_token,
        },
      },
    };
  }
}
