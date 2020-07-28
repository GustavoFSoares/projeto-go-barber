import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProvidersAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointmentsService', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeCacheProvider = new FakeCacheProvider();

		listProvidersAppointments = new ListProviderAppointmentsService(
			fakeAppointmentsRepository,
			fakeCacheProvider,
		);
	});

	it('Should be able to list the appointments on a specific day', async () => {
		const appointment1 = await fakeAppointmentsRepository.create({
			provider_id: 'provider-id',
			user_id: 'user-id',
			date: new Date(2020, 4, 20, 14, 0, 0),
		});

		const appointment2 = await fakeAppointmentsRepository.create({
			provider_id: 'provider-id',
			user_id: 'user-id',
			date: new Date(2020, 4, 20, 15, 0, 0),
		});

		const appointments = await listProvidersAppointments.execute({
			provider_id: 'provider-id',
			day: 20,
			month: 5,
			year: 2020,
		});

		expect(appointments).toEqual([appointment1, appointment2]);
	});
});
