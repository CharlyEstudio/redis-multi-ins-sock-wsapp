import { KeyService } from '../../keys/key.service';
import { Key } from '../../keys/key';

export const ClientRedis = {
  host: new KeyService().getKey(Key.REDIS_HOST),
  port: new KeyService().getKey(Key.REDIS_PORT),
  password: new KeyService().getKey(Key.REDIS_PASSWORD),
};
