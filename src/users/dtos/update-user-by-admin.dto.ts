import { UserRole } from '../../common/enums/user-role.enum';
import { IUpdateUserByAdmin } from '../interfaces/update-user-by-admin.interface';

export class UpdateUserByAdminDto implements IUpdateUserByAdmin {
  name?: string;

  email?: string;

  role?: UserRole;

  access_token?: string;
}
