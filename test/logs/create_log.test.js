const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const baseURL = 'http://localhost:5000';  // URL del servicio de logs

describe('Create Log Tests', () => {
  it('should create a new log with all required fields', (done) => {
    chai.request(baseURL)
      .post('/logs')
      .send({
        application: 'TestApp',
        type: 'ERROR',
        module: 'Auth',
        summary: 'Error in authentication',
        description: 'User failed to authenticate due to invalid credentials.'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('application', 'TestApp');
        expect(res.body).to.have.property('type', 'ERROR');
        expect(res.body).to.have.property('module', 'Auth');
        expect(res.body).to.have.property('summary', 'Error in authentication');
        expect(res.body).to.have.property('description', 'User failed to authenticate due to invalid credentials.');
        expect(res.body).to.have.property('createdAt');
        done();
      });
  });

  it('should not create a log if required fields are missing', (done) => {
    chai.request(baseURL)
      .post('/logs')
      .send({
        application: 'TestApp',
        type: 'ERROR'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
