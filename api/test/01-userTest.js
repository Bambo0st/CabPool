import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('User API', () => {
    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should log in an existing user', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                global.authToken = res.body.token; // Store token globally for other tests
                done();
            });
    });
});
