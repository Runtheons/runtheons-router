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
				return res.body.data.other.msg == 'ok' && res.body.status == true;
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
				return res.body.data.other.msg == 'ok' && res.body.status == true;
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
				return res.body.data.other.msg == 'ok' && res.body.status == true;
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
				return res.body.data.msg == 'ok' && res.body.status == true;
			})
			.end((err, res) => {
				if (err) return done(err);
				return done();
			});
	});
});