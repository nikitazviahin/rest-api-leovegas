import { registerAs } from '@nestjs/config';

export const MONGO_CONFIG = 'mongo_config';

export default registerAs(MONGO_CONFIG, () => ({
  users: {
    uri: process.env.MONGO_CONNECTION_URL,
  },
}));
