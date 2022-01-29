const path = require('path');
const fs = require('fs');
const Route = require('./Route');
const router = require('./test/server');

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
			routes = [...routes, ...this.scanDir(dirpath)];
		});
		this.avaibleFiles = routes;
		this.avaibleFiles.forEach((route) => {
			this.loadRoute(route.filename);
		});
		console.table(this.avaibleFiles);
	}

	scanDir(filepath) {
		var routes = [];
		if (fs.existsSync(filepath)) {
			var files = fs.readdirSync(filepath);
			for (var file of files) {
				var filename = path.join(filepath, file);
				var stat = fs.lstatSync(filename);
				if (stat.isDirectory()) {
					routes = [...routes, ...this.scanDir(filename)];
				} else {
					if (filename.indexOf('.js') >= 0) {
						var routeInfo = this.getRoute(filename);
						if (routeInfo != null && routeInfo.available) {
							routes.push(routeInfo);
						}
					}
				}
			}
		}
		return routes;
	}

	getRoute(filename) {
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

	loadRoute(filename) {
		var route = require(filename);
		route.load(this.app);
	}
};