import { UserRole } from '../../common/enums/user-role.enum';
import { ObjectId } from '../../common/types/object-id.type';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  access_token: string;
}
