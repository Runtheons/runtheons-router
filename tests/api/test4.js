const Route = require('../../Route');

module.exports = new Route({
	path: '/test4',
	method: 'GET',
	avaible: true,
	auth: [],
	schema: {},
	functionHandle: async function() {
		return { msg: 'ok' };
	}
});