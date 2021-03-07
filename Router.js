const path = require("path");
const fs = require("fs");
const Route = require("./Route");

module.exports = class Router {

	app = null;
	avaibleFiles = null;

	testRequest = null;

	constructor(app) {
		this.app = app;
		this.avaibleFiles = {};
	}

	getAvaibleRoute(routes) {
		if (!Array.isArray(routes)) {
			routes = [routes];
		}
		routes.forEach(p => {
			var dirpath = path.join(process.cwd(), p);
			dirpath = path.dirname(dirpath);
			this._scanDir(dirpath, this.avaibleFiles);
		});
		return this.avaibleFiles;
	}

	_createDirIfNotExist(node, dirName) {
		if (node[dirName] == undefined || node[dirName] == null) {
			node[dirName] = {};
		}
	}

	_scanDir(filepath, node) {
		if (fs.existsSync(filepath)) {
			var files = fs.readdirSync(filepath);
			var i = 0;
			for (var f of files) {
				var filename = path.join(filepath, f);
				var stat = fs.lstatSync(filename);
				if (stat.isDirectory()) {
					this._createDirIfNotExist(node, f);
					this._scanDir(filename, node[f]);
				} else if (filename.indexOf(".js") >= 0) {
					if (this.isAvaible(filename)) {
						node[i] = filename;
						i++;
					}
				}
			};
		}
	}

	load(node = null) {
		if (node == null) {
			this.load(this.avaibleFiles);
		} else {
			Object.keys(node).forEach(k => {
				if (typeof node[k] == "string") {
					this._loadRoute(node[k]);
				} else {
					this.load(node[k]);
				}
			});
		}
	}


	isAvaible(filename) {
		var route = require(filename);
		if (route instanceof Route) {
			return route.isAvaible();
		}
	}

	_loadRoute(filename) {
		var route = require(filename);
		route.load(this.app);
	}

	async test(filter, node = null) {
		if (node == null) {
			this.testRequest = require("@runtheons/tester")(this.app);
			var tests = await this.test(filter, this.avaibleFiles);
			return tests;
		} else {
			var result = {};
			var keys = Object.keys(node);
			for (var k of keys) {
				if (typeof node[k] == "string") {
					var res = await this._testRoute(node[k], filter);
					if (res != null) {
						result[k] = res;
					}
				} else {
					result[k] = await this.test(filter, node[k]);
				}
			}
			return result;
		}
	}

	async _testRoute(filename, filter) {
		var route = require(filename);

		var tests = {
			filename: filename,
			tests: []
		};

		if (filter.exec(route.path) != null) {
			tests.tests = await route.test(this.testRequest);
		}
		return tests;
	}
}