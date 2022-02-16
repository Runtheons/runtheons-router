const path = require('path');
const fs = require('fs');
const Route = require('./Route');

module.exports = class Router {
	app = null;
	avaibleFiles = null;

	constructor(app) {
		this.app = app;
		this.avaibleFiles = [];
	}

	getAvaibleFiles() {
		return this.avaibleFiles;
	}

	loadRoutes(dirpaths) {
		if (!Array.isArray(dirpaths)) {
			dirpaths = [dirpaths];
		}
		var routes = [];
		dirpaths.forEach((dirpath) => {
			dirpath = path.dirname(path.join(process.cwd(), dirpath));
			routes = [...routes, ...this._scanDir(dirpath)];
		});
		this.avaibleFiles = routes;
		this.avaibleFiles.forEach((route) => {
			this._loadRoute(route.filename);
		});
	}

	_scanDir(filepath) {
		var routes = [];
		if (fs.existsSync(filepath)) {
			var files = fs.readdirSync(filepath);
			for (var file of files) {
				var filename = path.join(filepath, file);
				var stat = fs.lstatSync(filename);
				if (stat.isDirectory()) {
					routes = [...routes, ...this._scanDir(filename)];
				} else {
					if (filename.indexOf('.js') >= 0) {
						var routeInfo = this._getRoute(filename);
						if (routeInfo != null && routeInfo.available) {
							routes.push(routeInfo);
						}
					}
				}
			}
		}
		return routes;
	}

	_getRoute(filename) {
		var route = require(filename);
		if (route instanceof Route) {
			return {
				path: route.getPath(),
				method: route.getMethod(),
				available: route.getAvailable(),
				filename: filename
			};
		}
		return null;
	}

	_loadRoute(filename) {
		var route = require(filename);
		route.load(this.app);
	}
};
