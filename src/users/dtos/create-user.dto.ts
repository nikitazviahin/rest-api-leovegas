import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ICreateUser } from '../interfaces/create-user.interface';

export class CreateUserDto implements ICreateUser {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  access_token: string;
}
