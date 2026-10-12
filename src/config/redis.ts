import Redis from "ioredis";
import {env} from './env';
import {logger} from './logger';

export const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    maxRetriesPerRequest: 3,
    lazyConnect: false,
    retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        logger.warn(`Redis retry attempt #${times} in ${delay}ms`);
        return delay;
    },
});


redis.on("connect", () => {
    logger.info(`✅ Redis connected → ${env.REDIS_HOST}:${env.REDIS_PORT}`)
});

redis.on("error",(err) => {
    logger.error({err}, "❌ Redis error");
});