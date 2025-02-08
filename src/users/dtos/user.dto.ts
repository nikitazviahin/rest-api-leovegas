import { IsEmail, IsEnum, IsMongoId, IsString } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import { IUser } from '../interfaces/user.interface';
import { ObjectId } from '../../common/types/object-id.type';
import {
  JsonApiDataDto,
  JsonApiResponseDto,
} from '../../common/dtos/json-api.dto';

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

export class JsonApiGetUserDetailsDto extends JsonApiResponseDto<
  Omit<UserDto, 'password'>
> {
  data: JsonApiDataDto<Omit<UserDto, 'password'>>;
}
