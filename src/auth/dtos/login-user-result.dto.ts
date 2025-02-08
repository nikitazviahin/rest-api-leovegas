import { IsString } from 'class-validator';
import { ILoginUserResult } from '../interfaces/login-user-result.interface';
import {
  JsonApiDataDto,
  JsonApiResponseDto,
} from '../../common/dtos/json-api.dto';

export class LoginUserResultDto implements ILoginUserResult {
  @IsString()
  access_token: string;
}

export class JsonApiLoginUserResultDto extends JsonApiResponseDto<LoginUserResultDto> {
  data: JsonApiDataDto<LoginUserResultDto>;
}
