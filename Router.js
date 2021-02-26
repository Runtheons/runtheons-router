const path = require("path");
const fs = require("fs");
const Route = require("./Route");

module.exports = class Router {

	app = null;
	avaibleFiles = null;

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

	test(filter, node = null) {
		if (node == null) {
			this.load(fiter, this.avaibleFiles);
		} else {
			Object.keys(node).forEach(k => {
				if (typeof node[k] == "string") {
					this._testRoute(node[k], filter);
				} else {
					this.test(filter, node[k]);
				}
			});
		}
	}
	
	_createDirIfNotExist(node, dirName) {
		if (node[dirName] == undefined || node[dirName] == null) {
			node[dirName] = {};
		}
	}

	_scanDir(filepath, node) {
		if (fs.existsSync(filepath)) {
			var files = fs.readdirSync(filepath);
			files.forEach(f => {
				var filename = path.join(filepath, f);
				var stat = fs.lstatSync(filename);
				if (stat.isDirectory()) {
					var dirName = path.basename(path.dirname(filename));
					this._createDirIfNotExist(node, dirName);
					this._scanDir(filename, node[dirName]);
				} else if (filename.indexOf(".js") >= 0) {
					if (this.isAvaible(filename)) {
						node[Object.keys(node).length] = filename;
					}
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

	_testRoute(filename, filter) {
		var route = require(filename);
		
		if(filter.exec(route.path) != null)
			route.test(this.app);
	}

}