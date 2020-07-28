import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import cacheConfig from '@config/cache';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
	host: cacheConfig.config.redis.host,
	port: cacheConfig.config.redis.port,
	password: cacheConfig.config.redis.password,
});

const limiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: 'ratelimit',
	points: 15,
	duration: 1,
});

export default async function rateLimiter(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		await limiter.consume(req.ip);
		return next();
	} catch (err) {
		throw new AppError('Too many requests', 429);
	}
}
