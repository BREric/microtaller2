describe('Get Logs Tests', () => {
    it('should get all logs ordered by creation date', (done) => {
      chai.request(baseURL)
        .get('/logs')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.greaterThan(0);
  
          // Verificar que los logs están ordenados por fecha de creación
          const isOrdered = res.body.every((log, index, array) => {
            return index === 0 || new Date(array[index - 1].createdAt) <= new Date(log.createdAt);
          });
  
          expect(isOrdered).to.be.true;
          done();
        });
    });
  });
  