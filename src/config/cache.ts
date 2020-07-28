import { RedisOptions } from 'ioredis';

interface IRedisInterface {
	driver: 'redis';

	config: {
		redis: RedisOptions;
	};
}

export default {
	driver: 'redis',
	config: {
		redis: {
			host: process.env.REDIS_HOST || 'localhost',
			port: process.env.REDIS_PORT || 6379,
			password: process.env.REDIS_PASS || undefined,
			// secretKey: process.env.REDIS_SECRET_KEY,
		},
	},
} as IRedisInterface;
