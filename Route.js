const dataManipule = require("@runtheons/data-manipulate");
const sessionManager = require("@runtheons/session-manager");
const validator = require("runtheons-validate");
const responseFactory = require("@runtheons/response-factory");
const Authorizzation = require("@runtheons/authorizzation");
const AuthorizzationToken = require("@runtheons/authorizzation/AuthorizzationToken");

module.exports = class Route {

	path = "/";

	method = "GET";

	constructor(obj = {}) {
		Object.assign(this, obj);
	}

	avaible = true;

	isAvaible() {
		return this.avaible;
	}

	load(router) {
		if (this.isAvaible()) {
			console.log(this.path + " is loaded");
			var method = this.method.toLowerCase();
			router[method](this.path, this.resolve);
		}
	}

	getData(req) {
		var data = {};

		Object.keys(req.params).forEach((key) => {
			this.parse(key, req.params[key], data);
		});

		Object.keys(req.body).forEach((key) => {
			this.parse(key, req.body[key], data);
		});

		if (req.files) {
			Object.keys(req.files).forEach((key) => {
				data[key] = req.files[key];
			});
		}

		return dataManipule.decode(data);
	}

	getSession(req) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		return sessionManager.extractData(token);
	}

	getOptions(req) {
		return responseFactory.getOption(req);
	}

	async resolve(req, res) {
		//Get Data
		var data = this.getData(req);
		var session = this.getSession(req);
		var headerResponseOption = this.getOptions(req);

		var responseData = {}

		//Authorizzation
		var auth = this.isAuthorized(session);
		if (auth.status) {
			//Validation
			var valid = this.isValid(data);
			if (valid.status) {
				responseData = await this.functionHandle(data, session);
			} else {
				responseData = await this.notValidDataHandle(valid.errors);
			}
		} else {
			responseData = await this.notAuthorizedHandle(auth.errors);
		}
		//Make Response with headerResponseOption
		responseFactory.setReponse(res);
		responseFactory.send(responseData, headerResponseOption);
	}

	auth = [];

	getAuthToken() {
		if (this.auth.length == 0)
			return new AuthorizzationToken();
		if (this.auth.length == 1)
			return this.auth[0];

		return Authorizzation.merge(this.auth);
	}

	isAuthorized(session) {
		var authToken = getAuthToken();
		return Authorizzation.execute(authToken, session);
	}

	notAuthorizedHandle = function(err) {
		return {
			msg: "Unauthorized user",
			status: false
		};
	};

	schema = {};

	isValid(data) {
		//Using Runtheons Validator
		return validator.validate(this.schema, data);
	}

	notValidDataHandle = function(err) {
		return {
			msg: "Not valid data",
			status: false
		};
	};

	functionHandle = function(data, session) {
		return {
			msg: "OK",
			status: true
		};
	};

}