const Route = require('./../../Route');
const MyAuth = require('./../MyAuth');

module.exports = new Route({
	path: '/login',
	method: 'POST',
	avaible: true,
	auth: [MyAuth.TEST],
	schema: {
		email: {
			type: 'email',
			required: true
		}
	},
	functionHandle: async function({ data, session }) {
		return { msg: 'ok' };
	}
});