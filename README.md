# Runtheons Router

npm package to manage the api endpoint

# Index

- [Introduction](https://github.com/Zexal0807/runtheons-router#introduction)
- [Getting started](https://github.com/Zexal0807/runtheons-router#getting-started)
  - [Prerequisites](https://github.com/Zexal0807/runtheons-router#prerequisites)
  - [Installation](https://github.com/Zexal0807/runtheons-router#installation)
- [Example of use](https://github.com/Zexal0807/runtheons-router#example-of-use)
- [System structure](https://github.com/Zexal0807/runtheons-router#system-structure)

# Introduction

This repository contains the source code and official documentation of api endpoint router system. If the aforementioned documentation is not clear or contains errors, please report it immediately to the email address **bugs-documentation@runtheons.com** or report the issue here on GitHub. Please be extremely clear and precise in the description of the issue so that moderators can correct it as soon as possible.

# Getting started

## Prerequisites

1. Git
2. Node: any 14.x version starting with v14.5.0 or greater

## Installation

1. `npm install https://github.com/Zexal0807/runtheons-router#2.2.0` to add the package to the project

# Example of use

Define an express application and import the library passing the app, then set the api path and load the api

```javascript
const app = require('express')();

const router = require('@runtheons/router')(app);
router.getAvaibleRoute('./api/*');
router.load();
```

Then define a Route

```javascript
const Route = require('@runtheons/router/Route');
const Authorizzation = require('../../Authorizzation');

module.exports = new Route({
	path: '/test',
	method: 'POST',
	avaible: true,
	auth: [
		Authorizzation.LOGGED
	],
	schema: {
		email: {
			....
		}
	},
	functionHandle: function(data, session, responseOption) {
		...
		return 1;
	}
});
```

## Router

Available method:

```javascript
	constructor(ExpressApplication app)

	getAvaibleRoute(String apiFiles)

	load()
```

## Route

Available method:

```javascript
	constructor(obj = {}) {
		Object.assign(this, obj);
	}

	isAvaible()

	getData(req)

	getToken(req)

	getSession(req)

	getOptions(req)

	printDebugFile(debug)

	executeWithoutResponse(data, session, responseOption, req)

	async execute(data, session, responseOption, req)

	async resolve(req, res)

	getAuth()

	isAuthorized(session, req)

	check(authToken, session, req);

	notAuthorizedHandle(err)

	isValid(data)

	notValidDataHandle(err)

	functionHandle(data, session, responseOption)

```
