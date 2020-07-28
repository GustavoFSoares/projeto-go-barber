import { inject, injectable } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';
import AppError from '@shared/errors/AppError';

// import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
	token: string;
	password: string;
}

@injectable()
class ResetPasswordService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,
	) {}

	public async execute({ token, password }: IRequest): Promise<void> {
		const userToken = await this.userTokensRepository.findByToken(token);
		if (!userToken) {
			throw new AppError('User token does not exists');
		}

		const user = await this.usersRepository.findById(userToken.user_id);
		if (!user) {
			throw new AppError('User does not exists');
		}

		const compareDate = addHours(userToken.created_at, 2);
		const dateNow = Date.now();

		if (isAfter(dateNow, compareDate)) {
			throw new AppError('Token expired');
		}

		user.password = await this.hashProvider.generateHash(password);
		await this.usersRepository.save(user);
	}
}

export default ResetPasswordService;
