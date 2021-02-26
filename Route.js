const SessionManager = require("@runtheons/session-manager");
const Validator = require("@runtheons/validate");
const ResponseFactory = require("@runtheons/response-factory");
const Authorizzation = require("@runtheons/authorizzation");

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
			router[method](this.path, (req, res) => {
				this.resolve(req, res)
			});
		}
	}

	getData(req) {
		var data = {};

		Object.keys(req.query).forEach((key) => {
			data[key] = req.query[key];
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

	getSession(req) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		return SessionManager.extractData(token);
	}

	getOptions(req) {
		return ResponseFactory.getOption(req);
	}

	async resolve(req, res) {
		//Get Data
		var data = this.getData(req);
		var session = this.getSession(req);
		var headerResponseOption = this.getOptions(req);

		var responseData = {};
		//Authorizzation
		var auth = this.isAuthorized(session);
		if (auth.status) {
			//Validation
			var valid = this.isValid(data);
			if (valid.status) {
				try {
					responseData.data = await this.functionHandle(data, session, headerResponseOption);
					responseData.status = true;
				} catch (err) {
					responseData.status = false;
					responseData.errors = err;
				}
			} else {
				responseData.status = false;
				responseData.errors = valid.errors;

				try {
					await this.notValidDataHandle(valid.errors)
				} catch (err) {
					console.log(err);
				}
			}
		} else {
			responseData.status = false;
			responseData.errors = auth.errors;

			try {
				await this.notAuthorizedHandle(auth.errors)
			} catch (err) {
				console.log(err);
			}
		}
		//Make Response with headerResponseOption
		ResponseFactory.setResponse(res);
		ResponseFactory.send(responseData, headerResponseOption);
	}

	auth = [];

	getAuth() {
		return this.auth;
	}

	isAuthorized(session) {
		var authToken = this.getAuth();
		return Authorizzation.check(authToken, session);
	}

	notAuthorizedHandle = function(err) {};

	schema = {};

	isValid(data) {
		return Validator.validate(this.schema, data);
	}

	notValidDataHandle = function(err) {};

	functionHandle = function(data, session, headerResponseOption) {
		return {};
	};

	tests = [];

	async test(request) {
		const asyncForEach = async(array, callback) => {
			for (let index = 0; index < array.length; index++) {
				await callback(array[index], index, array)
			}
		}

		var result = "\u001b[93m TEST \u001b[0m" + this.path;
		await asyncForEach(this.tests, async(t) => {
			await t.test(request)
				.then(() => {
					result += "\n  \u001b[32m" + "Success\u001b[0m - " + t.name;
				})
				.catch(() => {
					result += "\n  \u001b[31m" + "Failed\u001b[0m - " + t.name;
				});
		});
		return result;
	}

	get() {
		return {
			"path": this.path,
			"method": this.method,
			"schema": this.schema,
			"auth": this.auth
		}
	}

}