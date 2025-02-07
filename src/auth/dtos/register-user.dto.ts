import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import { IRegisterUser } from '../interfaces/register-user.interface';

export class RegisterUserDto implements IRegisterUser {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
