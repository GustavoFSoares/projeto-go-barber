// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;
let authentitaceUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUserService', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeCacheProvider = new FakeCacheProvider();

		createUser = new CreateUserService(
			fakeUserRepository,
			fakeHashProvider,
			fakeCacheProvider,
		);

		authentitaceUser = new AuthenticateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);
	});

	it('Should be able to authenticate a user', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		const response = await authentitaceUser.execute({
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(user);
	});

	it('Should not be able to authenticate with non existing user', async () => {
		await expect(
			authentitaceUser.execute({
				email: 'john.doe@gmail.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able to authenticate a user without password', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await expect(
			authentitaceUser.execute({
				email: 'john.doe@gmail.com',
				password: '',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able to authenticate with wrong password', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await expect(
			authentitaceUser.execute({
				email: 'john.doe@gmail.com',
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
