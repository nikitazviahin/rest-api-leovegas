import { UserRole } from '../../common/enums/user-role.enum';

export interface IUpdateUserByAdmin {
  name?: string;
  email?: string;
  role?: UserRole;
  access_token?: string;
}
