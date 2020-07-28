import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUsertokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;

let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
	beforeEach(() => {
		fakeMailProvider = new FakeMailProvider();
		fakeUsersRepository = new FakeUsersRepository();
		fakeUserTokensRepository = new FakeUserTokensRepository();

		sendForgotPasswordEmail = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakeMailProvider,
			fakeUserTokensRepository,
		);
	});

	it('Should be able to recover the password using the email', async () => {
		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

		await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await sendForgotPasswordEmail.execute({
			email: 'john.doe@gmail.com',
		});

		expect(sendMail).toHaveBeenCalled();
	});

	it('Should not be ale to to recover a non-existing user password', async () => {
		await expect(
			sendForgotPasswordEmail.execute({
				email: 'john.doe@gmail.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('Should generate a forgot password token', async () => {
		const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
		});

		await sendForgotPasswordEmail.execute({
			email: 'john.doe@gmail.com',
		});

		expect(generateToken).toHaveBeenCalledWith(user.id);
	});
});
