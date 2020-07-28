interface IMailConfig {
	driver: 'ethereal' | 'ses';
	defaults: {
		from: {
			email: string;
			name: string;
		};
	};
	region: string;
}

export default {
	driver: process.env.MAIL_DRIVER || 'ethereal',
	defaults: {
		from: {
			email: 'equipe@gobarber.com.br',
			name: 'Equipe GoBarber',
		},
	},
	region: process.env.AWS_DEFAULT_REGION,
} as IMailConfig;
