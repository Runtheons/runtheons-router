const request = require('supertest');

const server = require('./server');
const app = server.app;

describe('Test example', () => {
	test('GET /user/:id', (done) => {
		request(app)
			.post('/login')
			.send({ email: 'abc.abc@aabc.com' })
			.expect(200)
			.expect((res) => {
				res.body.status = true;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});
});