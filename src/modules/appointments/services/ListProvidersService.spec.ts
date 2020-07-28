import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersService', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUsersRepository();
		fakeCacheProvider = new FakeCacheProvider();

		listProviders = new ListProvidersService(
			fakeUserRepository,
			fakeCacheProvider,
		);
	});

	it('Should be able to list the providers', async () => {
		const user1 = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		const user2 = await fakeUserRepository.create({
			name: 'John Trê',
			email: 'john.tre@gmail.com',
			password: '123456',
		});

		const loggedUser = await fakeUserRepository.create({
			name: 'John Qua',
			email: 'john.qua@gmail.com',
			password: '123456',
		});

		const providers = await listProviders.execute({ user_id: loggedUser.id });

		expect(providers).toEqual([user1, user2]);
	});
});
