const Route = require('../../Route');
const MyAuth = require('../MyAuth');

module.exports = new Route({
	path: '/test1',
	method: 'POST',
	avaible: true,
	auth: [MyAuth.TEST],
	schema: {
		email: {
			type: 'email',
			required: true
		}
	},
	functionHandle: async function({ data, session, req, responseData }) {
		const a = require('./test4');
		var other = await a.authorize({
			data,
			session,
			req
		});

		return { my: data, other: other.data };
	}
});