import { IsEmail, IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';
import { IUser } from '../interfaces/user.interface';

export class UserDto implements IUser {
  @IsMongoId()
  _id: Types.ObjectId;

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
