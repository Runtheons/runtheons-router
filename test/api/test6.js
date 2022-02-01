const Route = require('../../Route');
const MyAuth = require('../MyAuth');

module.exports = new Route({
	path: '/test6',
	method: 'POST',
	avaible: true,
	auth: [MyAuth.TEST_NOT_AUTHORIZE],
	schema: {},
	functionHandle: async function() {
		return {};
	}
});