const responseFactory = require("@runtheons/response-factory");
const Authorizzation = require("@runtheons-authorizzation");

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

    load(router) {
        if (this.isAvaible()) {
            console.log(this.path + " is loaded");
            var method = this.method.toLowerCase();
            router[method](this.path, this.resolve);
        }
    }
    resolve(req, res) {
        //Make Response with headerResponseOption
        responseFactory.setReponse(res);
}