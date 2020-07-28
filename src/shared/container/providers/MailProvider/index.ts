import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';

const providers = {
	ethereal: container.resolve(EtherealMailProvider),
	ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
	'MailProvider',
	providers[mailConfig.driver],
);
