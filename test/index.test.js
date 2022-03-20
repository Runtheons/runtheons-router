const request = require('supertest');

const server = require('./server');
const app = server.app;

describe('Router', () => {
	test('Requiring from authorizate', () => {
		expect(server.getAvaibleFiles().length).toBe(10);
	});
});

describe('Routing', () => {
	test('Requiring from authorizate', (done) => {
		request(app)
			.post('/test1/11')
			.send({ email: 'abc.abc@aabc.com' })
			.expect(200)
			.expect((res) => {
				return res.body.data.other.msg == 'ok' && res.body.status;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('Requiring from validate', (done) => {
		request(app)
			.post('/test2')
			.send({ email: 'abc.abc@aabc.com' })
			.expect(200)
			.expect((res) => {
				return res.body.data.other.msg == 'ok' && res.body.status;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('Requiring functionHandle', (done) => {
		request(app)
			.post('/test3')
			.send({ email: 'abc.abc@aabc.com' })
			.expect(200)
			.expect((res) => {
				return res.body.data.other.msg == 'ok' && res.body.status;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('Simple GET request', (done) => {
		request(app)
			.get('/test4')
			.send()
			.expect(200)
			.expect((res) => {
				return res.body.data.msg == 'ok' && res.body.status;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('With invalid data', (done) => {
		request(app)
			.post('/test5')
			.send({})
			.expect(200)
			.expect((res) => {
				return (
					res.body.status &&
					res.body.errors.length > 0 &&
					!res.body.validation.status &&
					res.body.validation.errors.length > 0
				);
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('With unuthorized session', (done) => {
		request(app)
			.post('/test6')
			.send({})
			.expect(200)
			.expect((res) => {
				return (
					res.body.status &&
					res.body.errors.length > 0 &&
					!res.body.authorization.status &&
					res.body.authorization.errors.length > 0
				);
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('Returning a reject', (done) => {
		request(app)
			.get('/test7')
			.expect(200)
			.expect((res) => {
				return (!res.body.status &&
					res.body.errors.length > 0 &&
					res.body.authorization.status &&
					res.body.validation.status
				);
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('Exception throwed', (done) => {
		const fs = require('fs');
		if (fs.existsSync('./debug')) {
			fs.rmdirSync('./debug', { recursive: true });
		}
		request(app)
			.get('/test8')
			.expect(200)
			.expect((res) => {
				var files = fs.readdirSync('./debug');
				return !res.body.status && files.length > 0;
			})
			.end((err, res) => {
				if (fs.existsSync('./debug')) {
					fs.rmdirSync('./debug', { recursive: true });
				}
				if (err) return done(err);
				return done();
			});
	});

	test('Returning file', (done) => {
		request(app)
			.get('/test9')
			.send()
			.expect(200)
			.expect('Content-Type', /png/)
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});

	test('Simple GET request', (done) => {
		request(app)
			.get('?int=1&string=Ciao')
			.send()
			.expect(200)
			.expect((res) => {
				return res.body.data.msg == 'ok' && res.body.status;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});
});