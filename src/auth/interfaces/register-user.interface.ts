import { UserRole } from '../../common/enums/user-role.enum';

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
