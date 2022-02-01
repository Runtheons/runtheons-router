const SessionManager = require('@runtheons/session-manager');
const Validator = require('@runtheons/validate');
const Authorizzation = require('@runtheons/authorizzation');
const { Logger } = require('@runtheons/utils');

module.exports = class Route {
	path = '/';

	method = 'GET';

	available = true;

	auth = [];

	schema = {};

	constructor({
		path,
		method,
		available,
		auth,
		schema,
		notAuthorizedHandle,
		notValidDataHandle,
		functionHandle,
		successHandle,
		sendResponse
	}) {
		this.path = path || this.path;
		this.method = method || this.method;
		this.available = available || this.available;
		this.auth = auth || this.auth;
		this.schema = schema || this.schema;
		this.notAuthorizedHandle = notAuthorizedHandle || this.notAuthorizedHandle;
		this.notValidDataHandle = notValidDataHandle || this.notValidDataHandle;
		this.functionHandle = functionHandle || this.functionHandle;
		this.successHandle = successHandle || this.successHandle;
		this.sendResponse = sendResponse || this.sendResponse;
	}

	getMethod() {
		return this.method;
	}

	getPath() {
		return this.path;
	}

	getAvailable() {
		return this.available;
	}

	load(router) {
		if (this.available) {
			console.log(this.path + ' is loaded');
			var method = this.method.toLowerCase();
			router[method](this.path, async(req, res) => {
				await this.resolve(req, res);
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

	getEmptyResponseData({ data, session, req }) {
		var responseData = {
			status: false,
			errors: {},
			authorization: {
				status: false,
				errors: {}
			},
			validation: {
				status: false,
				errors: {}
			}
		};
		if (req != undefined) {
			responseData.request = {
				path: this.path,
				method: this.method,
				header: req.headers,
				data: data || {},
				session: session
			};
		}
		return responseData;
	}

	async resolve(req, res) {
		//Get Data
		var data = this.getData(req);
		var session = this.getSession(req);

		var responseData = this.getEmptyResponseData({ data, session, req });

		try {
			responseData = await this.authorize({
				data,
				session,
				req,
				responseData
			});
		} catch (err) {
			responseData.status = false;
			responseData.errors = err;
			if (!err.code) {
				responseData.errors = err;
				await Logger.printDebugFile(responseData);
			}
		}
		this.sendResponse({ req, res, responseData });
	}

	async authorize({ data, session, req, responseData }) {
		if (responseData == undefined) {
			responseData = this.getEmptyResponseData({ data, session, req });
		}
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
				responseData
			});
		} else {
			responseData.status = false;
			responseData.errors = responseData.authorization.errors;
			await this.notAuthorizedHandle(responseData.authorization.errors);
		}
		return responseData;
	}

	async validate({ data, session, req, responseData }) {
		if (responseData == undefined) {
			responseData = this.getEmptyResponseData({ data, session, req });
		}
		responseData.validation = await Validator.validate(this.schema, data);
		if (responseData.validation.status) {
			responseData.status = true;
			responseData.data = await this.functionHandle({
				data,
				session,
				req,
				responseData
			});
			await this.successHandle(responseData);
		} else {
			responseData.status = false;
			responseData.errors = responseData.validation.errors;
			await this.notValidDataHandle(responseData.validation.errors);
		}
		return responseData;
	}

	notAuthorizedHandle = function(err) {};

	notValidDataHandle = function(err) {};

	successHandle = function(responseData) {};

	functionHandle = function({ data, session, req, responseData }) {
		return {};
	};

	sendResponse({ req, res, responseData }) {
		res.status(200);
		res.json(responseData);
	}
};