import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfileService', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();

		updateProfile = new UpdateProfileService(
			fakeUserRepository,
			fakeHashProvider,
		);
	});

	it('Should be able update the profile', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'John Doe Doe',
			email: 'john.doe.doe@gmail.com',
		});

		expect(updatedUser.name).toBe('John Doe Doe');
		expect(updatedUser.email).toBe('john.doe.doe@gmail.com');
	});

	it('Should not be able to change to another user email', async () => {
		await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		const user = await fakeUserRepository.create({
			name: 'John Test',
			email: 'john.test@gmail.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Test',
				email: 'john.doe@gmail.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able update profile with non-existing user', async () => {
		await expect(
			updateProfile.execute({
				user_id: 'non-existing-user',
				name: 'John Doe Doe',
				email: 'john.doe.doe@gmail.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should be able update the password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'John Doe Doe',
			email: 'john.doe.doe@gmail.com',
			password: '123123',
			old_password: '123456',
		});

		expect(updatedUser.password).toBe('123123');
	});

	it('Should not be able update the password without old-password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Doe Doe',
				email: 'john.doe.doe@gmail.com',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should not be able update the password with wrong old-password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'John Doe Doe',
				email: 'john.doe.doe@gmail.com',
				password: '123123',
				old_password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
