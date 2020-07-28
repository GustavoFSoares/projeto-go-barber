import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';

import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm';
import '@shared/container';

import routes from './routes';
import rateLimiter from './middlewares/RateLimiter';

const app = express();

app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
	if (err instanceof AppError) {
		return response.status(err.statusCode).json({
			status: 'error',
			message: err.message,
		});
	}

	console.error(err);

	return response.status(500).json({
		status: 'error',
		message: 'Internal server error',
	});
});
app.listen(3333, () => {
	console.log('🚀 App Running');
});
