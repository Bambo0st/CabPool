import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Booking API', () => {
    it('should create a new booking', (done) => {
        chai.request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${global.authToken}`) // Use the global token
            .send({
                pickupLocation: 'New York',
                dropoffLocation: 'Boston',
                departureTime: new Date(Date.now() + 3600 * 1000),
                arrivalTime: new Date(Date.now() + 7200 * 1000),
                availableSeats: 4,
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('_id');
                done();
            });
    });

    it('should fetch all bookings', (done) => {
        chai.request(app)
            .get('/api/bookings')
            .set('Authorization', `Bearer ${global.authToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
