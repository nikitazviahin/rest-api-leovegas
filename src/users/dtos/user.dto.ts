import { IsEmail, IsEnum, IsMongoId, IsString } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import { IUser } from '../interfaces/user.interface';
import { ObjectId } from '../../common/types/object-id.type';

export class UserDto implements IUser {
  @IsMongoId()
  _id: ObjectId;

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
