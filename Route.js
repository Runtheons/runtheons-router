const SessionManager = require('@runtheons/session-manager');
const Validator = require('@runtheons/validate');
const ResponseFactory = require('@runtheons/response-factory');
const Authorizzation = require('@runtheons/authorizzation');
const { Logger } = require('@runtheons/utils');

module.exports = class Route {
	path = '/';

	method = 'GET';

	avaible = true;

	auth = [];

	schema = {};

	constructor({ path, method, avaible, auth, schema, functionHandle }) {
		this.path = path;
		this.method = method;
		this.avaible = avaible;
		this.auth = auth;
		this.schema = schema;
		this.functionHandle = functionHandle;
	}

	isAvaible() {
		return this.avaible;
	}

	server = null;

	load(server) {
		if (this.isAvaible()) {
			this.server = server;
			var router = server.app;
			console.log(this.path + ' is loaded');
			var method = this.method.toLowerCase();
			router[method](this.path, (req, res) => {
				this.resolve(req, res);
			});
		}
	}

	getData(req) {
		var data = {};

		Object.keys(req.query).forEach((key) => {
			let value = req.query[key];
			if (value === parseInt(value) + '') {
				value = parseInt(value);
			}
			data[key] = value;
		});

		Object.keys(req.params).forEach((key) => {
			data[key] = req.params[key];
		});

		Object.keys(req.body).forEach((key) => {
			data[key] = req.body[key];
		});

		if (req.files) {
			Object.keys(req.files).forEach((key) => {
				data[key] = req.files[key];
			});
		}

		return data;
	}

	getToken(req) {
		const authHeader = req.headers['authorization'];
		return authHeader && authHeader.split(' ')[1];
	}

	getSession(req) {
		const token = this.getToken(req);
		return token && SessionManager.extractData(token);
	}

	getOptions(req) {
		var option = ResponseFactory.getOption(req);
		option.token = this.getToken(req);
		return option;
	}

	async resolve(req, res) {
		//Get Data
		var data = this.getData(req);
		var session = this.getSession(req);
		var responseOption = this.getOptions(req);

		var responseData = {};
		try {
			responseData = await this.authorize({
				data,
				session,
				req,
				responseOption,
				responseData
			});
		} catch (err) {
			/********************************DEBUG*************************************************/
			if (
				(Array.isArray(responseData.errors) &&
					responseData.errors.length == 0) ||
				responseData.errors.code == undefined ||
				responseData.errors.msg == undefined ||
				responseOption.type == ResponseFactory.FILE
			) {
				var debug = {
					request: {
						path: this.path,
						method: this.method,
						header: responseOption.headers,
						data: data,
						session: session
					},
					response: responseData
				};

				Logger.printDebugFile(debug);
			}
			/**************************************************************************************/
		}

		//Make Response with responseOption
		ResponseFactory.setResponse(res);
		ResponseFactory.send(responseData, responseOption);
	}

	async authorize({ data, session, req, responseOption, responseData }) {
		responseData.authorization = await Authorizzation.check(
			this.auth,
			session,
			req
		);
		if (responseData.authorization.status) {
			responseData = await this.validate({
				data,
				session,
				req,
				responseOption,
				responseData
			});
		} else {
			responseData.status = false;
			responseData.errors = responseData.authorization.errors;
			await this.notAuthorizedHandle(responseData.authorization.errors);
		}
		return responseData;
	}

	async validate({ data, session, req, responseOption, responseData }) {
		responseData.validation = await Validator.validate(this.schema, data);
		if (responseData.validation.status) {
			responseData.status = true;
			responseData.data = await this.functionHandle({
				data,
				session,
				req,
				responseOption,
				responseData
			});
		} else {
			responseData.status = false;
			responseData.errors = responseData.validation.errors;
			await this.notValidDataHandle(responseData.validation.errors);
		}
		return responseData;
	}

	notAuthorizedHandle = function(err) {};

	notValidDataHandle = function(err) {};

	functionHandle = function({
		data,
		session,
		req,
		responseOption,
		responseData
	}) {
		return {};
	};
};