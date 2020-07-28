import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let availabilityHours: number[];

describe('ListProviderMonthAvailabilityService', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
			fakeAppointmentsRepository,
		);
		availabilityHours = Array.from({ length: 10 }, (_, index) => index + 8);
	});

	it('Should be able to list the month availability from provider', async () => {
		await availabilityHours.forEach(async hour => {
			await fakeAppointmentsRepository.create({
				provider_id: 'user',
				user_id: 'another-user',
				date: new Date(2020, 4, 20, hour, 0, 0),
			});
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'another-user',
			date: new Date(2020, 4, 21, 10, 0, 0),
		});

		const availability = await listProviderMonthAvailability.execute({
			provider_id: 'user',
			year: 2020,
			month: 5,
		});

		expect(availability).toEqual(
			expect.arrayContaining([
				{ day: 10, available: true },
				{ day: 20, available: false },
				{ day: 21, available: true },
				{ day: 22, available: true },
			]),
		);
	});
});
