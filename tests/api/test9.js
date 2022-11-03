const Route = require('../../Route');

module.exports = new Route({
	path: '/test9',
	method: 'GET',
	avaible: true,
	auth: [],
	schema: {},
	functionHandle: async function() {
		return require('path').join(process.cwd(), './test/api/test.png');
	},
	sendResponse: function({ req, res, responseData }) {
		res.status(200);
		res.sendFile(responseData.data);
	}
});