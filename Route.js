const sessionManager = require("@runtheons/session-manager");
const validator = null; //require("@runtheons/validate");
const responseFactory = require("@runtheons/response-factory");
const Authorizzation = require("@runtheons/authorizzation");
const AuthorizzationToken = require("@runtheons/authorizzation/AuthorizzationToken");

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
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        return sessionManager.getData(token);
    }

    getData(req) {
    }

    auth = [];

    getAuthToken() {
        if (this.auth.length == 0)
            return new AuthorizzationToken();
        if (this.auth.length == 1)
            return this.auth[0];

        return Authorizzation.merge(this.auth);
    }

    isAuthorized(session) {
        var authToken = getAuthToken();
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

    notValidDataHandle = function(err) {
        return {
            msg: "Not valid data",
            status: false
        };
    };

    functionHandle = function(data, session) {
        return {
            msg: "OK",
            status: true
        };
    };

}