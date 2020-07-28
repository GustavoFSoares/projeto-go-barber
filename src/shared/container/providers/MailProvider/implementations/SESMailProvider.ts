/* eslint-disable no-console */
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';

import IStorageProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IStorageProvider {
	private client: Transporter;

	constructor(
		@inject('MailTemplateProvider')
		private mailTemplateProvider: IMailTemplateProvider,
	) {
		this.client = nodemailer.createTransport({
			SES: new aws.SES({
				apiVersion: '2010-12-01',
				region: mailConfig.region,
			}),
		});
	}

	public async sendMail({
		to,
		from,
		subject,
		templateData,
	}: ISendMailDTO): Promise<void> {
		await this.client.sendMail({
			from: {
				name: from?.name || mailConfig.defaults.from.name,
				address: from?.email || mailConfig.defaults.from.email,
			},
			to: {
				name: to.name,
				address: to.email,
			},
			subject,
			html: await this.mailTemplateProvider.parse(templateData),
		});
	}
}
