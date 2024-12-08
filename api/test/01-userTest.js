// api/test/01-userTest.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('User API', () => {
    // Cleanup test user and associated bookings before starting the tests
    before(async () => {
        try {
            const testUser = await User.findOne({ email: 'testuser@example.com' });
            if (testUser) {
                await Booking.deleteMany({ createdBy: testUser._id });
                await User.deleteOne({ _id: testUser._id });
            }
        } catch (error) {
            console.error('Error cleaning up test user data:', error);
        }
    });

    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/users/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.message).to.equal('User registered successfully');
                done();
            });
    });

    it('should log in an existing user', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('user');
                expect(res.body.user.email).to.equal('testuser@example.com');
                done();
            });
    });
});
