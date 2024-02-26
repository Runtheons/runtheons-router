const request = require('supertest');

const server = require('./server');
const app = server.app;

describe('Router', () => {
	test('Get available files', () => {
		expect(server.getAvaibleFiles().length).toBe(10);
	});
});

describe('Routing', () => {
	test('Requiring from authorizate', (done) => {
		request(app)
			.post('/test1/11')
			.send({ email: 'abc.abc@aabc.com' })
			.then(response => {
				expect(response.statusCode).toBe(200);
				return response.body
			})
			.then((body) => {
				expect(body.other.msg).toBe('ok');
				done();
			});
	});

	test('Requiring from validate', (done) => {
		request(app)
			.post('/test2')
			.send({ email: 'abc.abc@aabc.com' })
			.then(response => {
				expect(response.statusCode).toBe(200);
				return response.body
			})
			.then((body) => {
				expect(body.other.msg).toBe('ok');
				done();
			});
	});

	test('Requiring functionHandle', (done) => {
		request(app)
			.post('/test3')
			.send({ email: 'abc.abc@aabc.com' })
			.then(response => {
				expect(response.statusCode).toBe(200);
				return response.body
			})
			.then((body) => {
				expect(body.other.msg).toBe('ok');
				done();
			});
	});

	test('Simple GET request', (done) => {
		request(app)
			.get('/test4')
			.send()
			.then(response => {
				expect(response.statusCode).toBe(200);
				return response.body
			})
			.then((body) => {
				expect(body.msg).toBe('ok');
				done();
			});
	});

	test('With invalid data', (done) => {
		request(app)
			.post('/test5')
			.send({})
			.then(response => {
				expect(response.statusCode).toBe(402);
				done();
			});
	});

	test('With unuthorized session', (done) => {
		request(app)
			.post('/test6')
			.send({})
			.then(response => {
				expect(response.statusCode).toBe(403);
				done();
			});
	});

	test('Returning a reject', (done) => {
		request(app)
			.get('/test7')
			.then(response => {
				expect(response.statusCode).toBe(405);
				done();
			});
	});

	test('Exception throwed', (done) => {
		const fs = require('fs');
		if (fs.existsSync('./debug')) {
			fs.rmdirSync('./debug', { recursive: true });
		}
		request(app)
			.get('/test8')
			.then(response => {
				expect(response.statusCode).toBe(401);
				return response.body
			})
			.then((body) => {
				if (fs.existsSync('./debug')) {
					fs.rmdirSync('./debug', { recursive: true });
				}
				done();
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

});