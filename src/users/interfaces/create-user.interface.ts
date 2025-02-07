import { UserRole } from '../../common/enums/user-role.enum';

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  access_token: string;
}
