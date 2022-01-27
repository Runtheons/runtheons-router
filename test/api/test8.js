const Route = require('../../Route');

module.exports = new Route({
	path: '/test8',
	method: 'GET',
	avaible: true,
	auth: [],
	schema: {},
	functionHandle: async function({ data, session }) {
		// This is an error (Exception is not define)
		throw new Exception();
	}
});