const Scanner = require("./Scanner");

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
            Scanner.scanDir(dirpath);
        });
    }

}