import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { JsonApiLoginUserResultDto } from './dtos/login-user-result.dto';
import { JsonApiRegisterUserResultDto } from './dtos/register-user-result.dto';
import { JsonApiErrorResponseDto } from '../common/dtos/json-api-error.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerUserDTO: RegisterUserDto,
  ): Promise<JsonApiRegisterUserResultDto | JsonApiErrorResponseDto> {
    const hashedPassword = await bcrypt.hash(registerUserDTO.password, 10);

    const createdUser = await this.userService.create({
      ...registerUserDTO,
      password: hashedPassword,
      access_token: '',
    });

    return {
      data: {
        type: 'users',
        id: createdUser._id.toString(),
        attributes: {
          _id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          access_token: createdUser.access_token,
        },
      },
    };
  }

  async login(
    loginUserDTO: LoginUserDto,
  ): Promise<JsonApiLoginUserResultDto | JsonApiErrorResponseDto> {
    const user = await this.validateUser(
      loginUserDTO.email,
      loginUserDTO.password,
    );

    if (!user) {
      return {
        errors: [
          {
            status: '401',
            title: 'Unathorized',
            detail: 'Invalid credentials',
          },
        ],
      };
    }

    const payload = { email: user.email, id: user._id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    await this.userService.updateUserById(user._id, {
      access_token,
    });

    return {
      data: {
        type: 'users',
        id: user._id.toString(),
        attributes: {
          access_token,
        },
      },
    };
  }

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
