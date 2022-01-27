const Route = require('../../Route');
const MyAuth = require('../MyAuth');

module.exports = new Route({
	path: '/test5',
	method: 'POST',
	avaible: true,
	auth: [MyAuth.TEST],
	schema: {
		email: {
			type: 'email',
			required: true
		}
	},
	functionHandle: async function() {
		return {};
	}
});