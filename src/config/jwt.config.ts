import { registerAs } from '@nestjs/config';

export const JWT_CONFIG = 'jwt_config';

export default registerAs(JWT_CONFIG, () => ({
  users: {
    uri: process.env.JWT_SECRET,
  },
}));
