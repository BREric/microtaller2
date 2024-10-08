const request = require('supertest');
const faker = require('@faker-js/faker').faker;
let expect;

// Carga dinámica de chai
before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
});

describe('User API', () => {
    let token;
    let userData;
    const baseUrl = 'http://localhost:8080';

    before(() => {
        userData = {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(12)
        };
    });

    it('should create a new user', async () => {
        const res = await request(baseUrl)
            .post('/users')
            .send({
                username: userData.username,
                email: userData.email,
                password: userData.password
            });

        expect(res.statusCode).to.equal(201);
        expect(res.body).to.have.property('id');
    });

    it('should login and return a JWT token', async () => {
        const res = await request(baseUrl)
            .post('/login')
            .send({
                username: userData.username,
                password: userData.password
            });

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('token');
        token = res.body.token;
    });

    it('should update the user information', async () => {
        const updatedEmail = faker.internet.email();

        const res = await request(baseUrl)
            .put('/update_user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: userData.username,
                email: updatedEmail
            });

        expect(res.statusCode).to.equal(204);
    });
});
