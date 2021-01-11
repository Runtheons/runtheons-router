const path = require("path");
const fs = require("fs");
const Route = require("./Route");

module.exports = class Router {

    app = null;

    constructor(app) {
        this.app = app;
    }

    load(routes) {
        if (!Array.isArray(routes)) {
            routes = [routes];
        }
        routes.forEach(p => {
            var dirpath = path.join(process.cwd(), p);
            dirpath = path.dirname(dirpath);
            this.scanDir(dirpath);
        });
    }

    scanDir(filepath) {
        if (fs.existsSync(filepath)) {
            var files = fs.readdirSync(filepath);
            files.forEach(f => {
                var filename = path.join(filepath, f);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    this.scanDir(filename);
                } else if (filename.indexOf(".js") >= 0) {
                    this.loadRoute(filename);
                }
            });
        }
    }

    loadRoute(filename) {
        var route = require(filename);
        if (route instanceof Route) {
            route.load(this.app);
        }
    }

}