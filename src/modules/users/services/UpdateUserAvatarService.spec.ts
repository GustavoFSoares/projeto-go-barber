import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeStorageProvider = new FakeStorageProvider();

		updateUserAvatar = new UpdateUserAvatarService(
			fakeUserRepository,
			fakeStorageProvider,
		);
	});

	it('Should be able update avatar', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		expect(user.avatar).toBe('avatar.jpg');
	});

	it('Should not be able to update avatar from non existing user', async () => {
		await expect(
			updateUserAvatar.execute({
				user_id: 'non-existing-user',
				avatarFilename: 'avatar.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should delete old avatar when updating new one', async () => {
		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'old-avatar.jpg',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		expect(deleteFile).toHaveBeenCalledWith('old-avatar.jpg');
		expect(user.avatar).toBe('avatar.jpg');
	});
});
