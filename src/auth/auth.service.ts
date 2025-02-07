import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { LoginUserResultDto } from './dtos/login-user-result.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDTO: RegisterUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(registerUserDTO.password, 10);

    return this.userService.create({
      ...registerUserDTO,
      password: hashedPassword,
      access_token: '',
    });
  }

  async login(loginUserDTO: LoginUserDto): Promise<LoginUserResultDto> {
    const user = await this.validateUser(
      loginUserDTO.email,
      loginUserDTO.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, id: user._id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    await this.userService.updateUserById(user._id, {
      access_token,
    });

    return {
      access_token,
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
