describe('Filter Logs Tests', () => {
    it('should filter logs by application name', (done) => {
      chai.request(baseURL)
        .get('/logs?application=TestApp')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach((log) => {
            expect(log.application).to.equal('TestApp');
          });
          done();
        });
    });
  
    it('should filter logs by date range', (done) => {
      chai.request(baseURL)
        .get('/logs?startDate=2024-10-01&endDate=2024-10-06')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach((log) => {
            const createdAt = new Date(log.createdAt);
            expect(createdAt).to.be.within(new Date('2024-10-01'), new Date('2024-10-06'));
          });
          done();
        });
    });
  
    it('should filter logs by type', (done) => {
      chai.request(baseURL)
        .get('/logs?type=ERROR')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach((log) => {
            expect(log.type).to.equal('ERROR');
          });
          done();
        });
    });
  });
  