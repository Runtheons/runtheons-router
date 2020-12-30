const validator = null; //require("@runtheons/validate");
const responseFactory = require("@runtheons/response-factory");
const Authorizzation = require("@runtheons/authorizzation");

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
        //Get Data
        var data = this.getData(req);
        var session = this.getSession(req);
        var headerResponseOption = this.getOptions(req);

        var responseData = {}

        //Authorizzation
        var auth = this.isAuthorized(session);
        if (auth.status) {
            //Validation
            var valid = this.isValid(data);
            if (valid.status) {
                responseData = this.functionHandle(data, session);
            } else {
                responseData = this.notValidDataHandle(valid.errors);
            }
        } else {
            responseData = this.notAuthorizedHandle(auth.errors);
        }
        //Make Response with headerResponseOption
        responseFactory.setReponse(res);
        responseFactory.send(responseData, headerResponseOption);
    }

    getSession(req) {
    }

    getData(req) {
    }

    isAuthorized(session) {
    }

    notAuthorizedHandle = function(err) {
        return {
            msg: "Unauthorized user",
            status: false
        };
    };
    schema = {};

    isValid(data) {
        //Using Runtheons Validator
        var valid = validator.validate(this.schema, data);
        return valid;
    }
    functionHandle = function(data, session) {
        return {
            msg: "OK",
            status: true
        };
    };

}