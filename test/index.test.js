const request = require('supertest');

const server = require('./server');
const app = server.app;

describe('Test example', () => {
	test('Requiring from authorizate', (done) => {
		request(app)
			.post('/test1')
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
	/*
	test('Return reject', (done) => {
		request(app)
			.get('/test5')
			.expect(200)
			.expect((res) => {
				console.log(res.body);
				return res.body.status == true;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});*/
});