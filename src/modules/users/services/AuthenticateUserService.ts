import { sign } from 'jsonwebtoken';

import auth from '@config/auth';
import AppError from '@shared/errors/AppError';

import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
	email: string;
	password: string;
}

interface IResponse {
	user: User;
	token: string;
}

@injectable()
class AuthenticateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({ email, password }: IRequest): Promise<IResponse> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) {
			throw new AppError('Incorrect email/password combination', 400);
		}

		const passwordMatched = await this.hashProvider.compareHash(
			password,
			user.password,
		);
		if (!passwordMatched) {
			throw new AppError('Incorrect email/password combination');
		}

		const { secret, expiresIn } = auth.jwt;
		const token = sign({}, secret, {
			subject: user.id,
			expiresIn,
		});

		return { user, token };
	}
}

export default AuthenticateUserService;
