import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
// import { GlobalConfig } from "../../config/global.config";

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
    //   host: GlobalConfig.redis_host,
    //   port: Number(GlobalConfig.redis_port),
    host: process.env.REDIS_HOST || 'localhost',  // Replace with GlobalConfig.redis_host if applicable
    port: Number(process.env.REDIS_PORT) || 6379, // Replace with GlobalConfig.redis_port if applicable
    });
  },
  provide: 'REDIS_CLIENT',
};