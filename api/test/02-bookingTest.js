import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js'; // Your app
import Booking from '../models/booking.model.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Booking API', () => {
    let cookie;

    before(async () => {
        const res = await chai.request(app)
            .post('/api/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        cookie = res.headers['set-cookie'][0];
        // console.log('Authentication Cookie:', cookie);  
    });

    it('should create a new booking', (done) => {
        chai.request(app)
            .post('/api/bookings')
            .set('Cookie', cookie) // Set the cookie for authentication
            .send({
                pickupLocation: 'Location A',
                dropoffLocation: 'Location B',
                departureTime: new Date('2028-12-25T14:00:00'),  // 25th December, 2 PM
                arrivalTime: new Date('2028-12-25T15:00:00'),    // 25th December, 3 PM

                availableSeats: 3,
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message').eql('Booking created successfully');
                done();
            });
    });

    it('should fetch all bookings', (done) => {
        chai.request(app)
            .get('/api/bookings')
            .set('Cookie', cookie) // Set the cookie for authentication
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should not create a booking without authentication', (done) => {
        chai.request(app)
            .post('/api/bookings')
            .send({
                pickupLocation: 'Location A',
                dropoffLocation: 'Location B',
                departureTime: new Date(),
                arrivalTime: new Date(),
                availableSeats: 3,
            })
            .end((err, res) => {
                expect(res).to.have.status(401); // Unauthorized
                done();
            });
    });

});
