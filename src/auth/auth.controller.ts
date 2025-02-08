import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JsonApiLoginUserResultDto } from './dtos/login-user-result.dto';
import { JsonApiErrorResponseDto } from '../common/dtos/json-api-error.dto';
import { JsonApiRegisterUserResultDto } from './dtos/register-user-result.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerUserDTO: RegisterUserDto,
  ): Promise<JsonApiRegisterUserResultDto | JsonApiErrorResponseDto> {
    return this.authService.register(registerUserDTO);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<JsonApiLoginUserResultDto | JsonApiErrorResponseDto> {
    return this.authService.login(loginUserDto);
  }
}
