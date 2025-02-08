import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { JsonApiGetUserDetailsDto, UserDto } from './dtos/user.dto';
import { ObjectId } from '../common/types/object-id.type';
import { JsonApiErrorResponseDto } from '../common/dtos/json-api-error.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JsonApiGetAllUsersDetailsDto } from './dtos/get-users.dto';
import { UpdateUserByAdminDto } from './dtos/update-user-by-admin.dto';
import { JsonApiResponseDto } from '../common/dtos/json-api.dto';

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

  async updateUserDetails(
    userId: string,
    dto: UpdateUserDto,
    requestUser: UserDto,
  ): Promise<JsonApiGetUserDetailsDto | JsonApiErrorResponseDto> {
    const user = await this.userModel.findById(userId);

    if (user._id.toString() !== requestUser._id.toString()) {
      return {
        errors: [
          {
            status: '403',
            title: 'Forbidden',
            detail: 'No permission to update the resource',
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

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;

    await user.save();

    return {
      data: {
        type: 'users',
        id: user._id.toString(),
        attributes: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          access_token: user.access_token,
        },
      },
    };
  }

  async getAllUsers(): Promise<
    JsonApiGetAllUsersDetailsDto | JsonApiErrorResponseDto
  > {
    const users = await this.userModel.find().select('-password');

    return {
      data: users.map((user) => ({
        type: 'users',
        id: user._id.toString(),
        attributes: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          access_token: user.access_token,
        },
      })),
    };
  }

  async updateUserByAdmin(
    userId: string,
    dto: UpdateUserByAdminDto,
  ): Promise<JsonApiGetUserDetailsDto | JsonApiErrorResponseDto> {
    const user = await this.userModel.findById(userId);

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

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.role) user.role = dto.role;
    if (dto.access_token) user.access_token = dto.access_token;

    await user.save();

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

  async deleteUser(
    userId: string,
  ): Promise<JsonApiResponseDto<null> | JsonApiErrorResponseDto> {
    const user = await this.userModel.findById(userId);

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

    if (user.role === 'ADMIN') {
      return {
        errors: [
          {
            status: '403',
            title: 'Forbidden',
            detail: 'You cannot delete another ADMIN user',
          },
        ],
      };
    }

    await this.userModel.findByIdAndDelete(userId);

    return {
      data: null,
      meta: {
        message: 'User successfully deleted',
      },
    };
  }
}
