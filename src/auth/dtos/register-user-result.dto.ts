import {
  JsonApiDataDto,
  JsonApiResponseDto,
} from '../../common/dtos/json-api.dto';
import { UserDto } from '../../users/dtos/user.dto';

export class JsonApiRegisterUserResultDto extends JsonApiResponseDto<
  Omit<UserDto, 'password'>
> {
  data: JsonApiDataDto<Omit<UserDto, 'password'>>;
}
