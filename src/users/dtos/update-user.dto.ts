import { IUpdateUser } from '../interfaces/update-user.interface';

export class UpdateUserDto implements IUpdateUser {
  name?: string;

  email?: string;
}
