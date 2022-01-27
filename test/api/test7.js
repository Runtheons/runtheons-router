const Route = require('../../Route');

module.exports = new Route({
	path: '/test7',
	method: 'GET',
	avaible: true,
	auth: [],
	schema: {},
	functionHandle: async function({ data, session }) {
		return new Promise((resolve, reject) => {
			return reject({
				code: '1',
				message: 'ok'
			});
		});
	}
});