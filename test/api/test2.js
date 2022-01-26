const Route = require('../../Route');
const MyAuth = require('../MyAuth');

module.exports = new Route({
	path: '/test2',
	method: 'POST',
	avaible: true,
	auth: [MyAuth.TEST],
	schema: {
		email: {
			type: 'email',
			required: true
		}
	},
	functionHandle: async function({
		data,
		session,
		req,
		responseOption,
		responseData
	}) {
		const a = require('./test4');
		var other = await a.validate({
			data,
			session,
			req,
			responseOption,
			responseData
		});

		return { my: data, other: other.data };
	}
});