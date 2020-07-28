export default {
	jwt: {
		secret: process.env.APP_SECRET || 'secret-key',
		expiresIn: '1d',
	},
};
