describe('Pagination Tests', () => {
    it('should return logs in pages with specified limit and page number', (done) => {
      chai.request(baseURL)
        .get('/logs?page=1&limit=5')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.lessThanOrEqual(5);
          done();
        });
    });
  
    it('should return logs for the next page', (done) => {
      chai.request(baseURL)
        .get('/logs?page=2&limit=5')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.lessThanOrEqual(5);
          done();
        });
    });
  });
  