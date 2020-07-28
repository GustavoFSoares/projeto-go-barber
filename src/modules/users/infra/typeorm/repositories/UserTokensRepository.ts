import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
	private ormRepository: Repository<UserToken>;

	constructor() {
		this.ormRepository = getRepository(UserToken);
	}

	public async findByToken(token: string): Promise<UserToken | undefined> {
		const findAppoinntment = await this.ormRepository.findOne({
			where: { token },
		});

		return findAppoinntment;
	}

	public async generate(user_id: string): Promise<UserToken> {
		const userToken = this.ormRepository.create({
			user_id,
		});

		await this.ormRepository
			.createQueryBuilder()
			.delete()
			.where({ where: { user_id } })
			.execute();

		await this.ormRepository.save(userToken);

		return userToken;
	}
}
export default UserTokensRepository;
