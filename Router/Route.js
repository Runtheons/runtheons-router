
module.exports = class Route {

    path = "/";

    method = "GET";


    load(router) {
        if (this.isAvaible()) {
            console.log(this.path + " is loaded");
            var method = this.method.toLowerCase();
            router[method](this.path, this.resolve);
        }
    }
}