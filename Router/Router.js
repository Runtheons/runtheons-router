const path = require('path');
const fs = require('fs');

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
            this._scandDir(path.dirname(path.join(process.cwd(), p)));
        });
    }

    _scandDir(filepath) {
        if (!fs.existsSync(filepath)) {
            console.log("Dir not found", filepath);
            return;
        }
        var files = fs.readdirSync(filepath);

        for (var i = 0; i < files.length; i++) {
            var filename = path.join(filepath, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                //Scan recursive directory
                this._scandDir(filename);
            } else if (filename.indexOf(".js") >= 0) {
                //Found .js file
                this._loadRoute(filename);
            };
        };
    }

    _loadRoute(filename) {
        var route = require(filename);
        if (route instanceof Route) {
            route.generete(this.app);
        }
    }

}(app)