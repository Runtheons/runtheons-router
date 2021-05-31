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

	server = null;

	load(server) {
		if (this.isAvaible()) {
			this.server = server;
			var router = server.app;
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

	printDebugFile(debug) {
		const fs = require("fs");
		var path = "./debug/";
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true });
		}
		var time = new Date();
		path += time.toISOString().slice(0, 10) + ' ';

		path += time.toString().slice(16, 24).replace(/:/g, "-");

		if (fs.existsSync(path + ".txt")) {
			path += "-" + (Math.floor((Math.random() * 1000) + 1));
		}

		path += '.txt';
		fs.open(path, 'a', function(e, file) {
			if (e)
				throw e;
			var str = require('util').inspect(debug);
			str = str + '\n\r';
			fs.write(file, str, function(er) {
				if (er)
					throw er;
				fs.close(file, function() {});
			});
		});
	}

	async resolve(req, res) {
		//Get Data
		var data = this.getData(req);
		var session = this.getSession(req);
		var responseOption = this.getOptions(req);

		var responseData = {};
		//Authorizzation
		var auth = this.isAuthorized(session, req);
		if (auth.status) {
			//Validation
			var valid = this.isValid(data);
			if (valid.status) {
				try {
					responseData.data = await this.functionHandle(data, session, responseOption);
					responseData.status = true;
				} catch (err) {
					responseData.status = false;
					responseData.errors = err;
					/********************************DEBUG*************************************************/
					if (
						(Array.isArray(responseData.errors) && responseData.errors.length == 0) ||
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
							response: responseData,
						};
						this.printDebugFile(debug);
					}
					/**************************************************************************************/
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
		//Make Response with responseOption
		ResponseFactory.setResponse(res);
		ResponseFactory.send(responseData, responseOption);
	}

	auth = [];

	getAuth() {
		return this.auth;
	}

	isAuthorized(session, req) {
		var authToken = this.getAuth();
		return Authorizzation.check(authToken, session, req);
	}

	notAuthorizedHandle = function(err) {};

	schema = {};

	isValid(data) {
		return Validator.validate(this.schema, data);
	}

	notValidDataHandle = function(err) {};

	functionHandle = function(data, session, responseOption) {
		return {};
	};

	tests = [];

	async test(request) {
		var result = [];
		for (var i = 0; i < this.tests.length; i++) {
			var t = this.tests[i];
			await t.test(request).then((d) => {
				result.push(d);
			});
		};
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