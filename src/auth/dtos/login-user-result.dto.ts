import { IsString } from 'class-validator';
import { ILoginUserResult } from '../interfaces/login-user-result.interface';

export class LoginUserResultDto implements ILoginUserResult {
  @IsString()
  access_token: string;
}
