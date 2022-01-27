const Authorizzation = require('@runtheons/authorizzation');

Authorizzation.add('TEST', {
	check: (session) => {
		return session == undefined;
	},
	success: () => {},
	error: () => {
		return {};
	}
});

Authorizzation.add('TEST_NOT_AUTHORIZE', {
	check: (session) => {
		return false;
	},
	success: () => {},
	error: () => {
		return {};
	}
});

module.exports = Authorizzation;