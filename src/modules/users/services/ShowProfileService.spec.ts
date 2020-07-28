import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfileService', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();

		showProfile = new ShowProfileService(fakeUserRepository);
	});

	it('Should be able to show the profile', async () => {
		const { id } = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		const user = await showProfile.execute({
			user_id: id,
		});

		expect(user.name).toBe('John Doe');
		expect(user.email).toBe('john.doe@gmail.com');
	});

	it('Should not be able to show the profile from non-existing user', async () => {
		expect(
			showProfile.execute({
				user_id: 'non-existing-user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
