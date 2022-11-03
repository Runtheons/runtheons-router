const Authorizzation = require('@runtheons/authorizzation');

Authorizzation.add('TEST', {
	check: (session) => {
		return session == undefined;
	}
});

Authorizzation.add('TEST_NOT_AUTHORIZE', {
	check: (session) => {
		return false;
	}
});

module.exports = Authorizzation;