const Authorizzation = require('@runtheons/authorizzation');

Authorizzation.add('TEST', {
	check: (session) => {
		return session == undefined;
	},
	success: () => {},
	error: () => {
		return { msg: 'Session already set', code: 'A1' };
	}
});

module.exports = Authorizzation;