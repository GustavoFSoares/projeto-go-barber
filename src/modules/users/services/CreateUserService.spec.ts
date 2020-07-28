import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUserService', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeCacheProvider = new FakeCacheProvider();

		createUser = new CreateUserService(
			fakeUserRepository,
			fakeHashProvider,
			fakeCacheProvider,
		);
	});

	it('Should be able to create a new user', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		expect(user).toHaveProperty('id');
	});

	it('Should not be able to create a new user with same email from another', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await expect(
			createUser.execute({
				name: 'John Doe',
				email: 'john.doe@gmail.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
