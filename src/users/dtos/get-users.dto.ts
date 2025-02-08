import {
  JsonApiDataDto,
  JsonApiResponseDto,
} from '../../common/dtos/json-api.dto';
import { UserDto } from './user.dto';

export class JsonApiGetAllUsersDetailsDto extends JsonApiResponseDto<
  Omit<UserDto, 'password'>
> {
  data: JsonApiDataDto<Omit<UserDto, 'password'>>[];
}
