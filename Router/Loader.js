const Route = requrie("./Route");

module.exports = class Loader {

    loadRoute(filename) {
        var route = require(filename);
        if (route instanceof Route) {
            route.load(this.app);
        }
    }

}