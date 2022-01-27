const Route = require('../../Route');
const ResponseFactory = require('@runtheons/response-factory/ResponseFactory');

module.exports = new Route({
	path: '/test9',
	method: 'GET',
	avaible: true,
	auth: [],
	schema: {},
	functionHandle: async function({ responseOption }) {
		responseOption.type = ResponseFactory.FILE;
		return require('path').join(process.cwd(), './test/api/test.png');
	}
});