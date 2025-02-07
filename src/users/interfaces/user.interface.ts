import { Types } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  access_token: string;
}
