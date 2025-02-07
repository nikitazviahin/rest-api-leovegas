import { IsEmail, IsString } from 'class-validator';
import { ILoginUser } from '../interfaces/login-user.interface';

export class LoginUserDto implements ILoginUser {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
