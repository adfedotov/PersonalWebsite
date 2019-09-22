const expect = require('chai').expect;
const request = require('request');

const hrefBase = 'http://127.0.0.1:3000';

describe('Authentification', function() {
  describe('Login', function() {
    it('should return 401 when access code not valid', function(done) {
      request.post({url: hrefBase + '/login', body: 'foobar'}, function(err, res, body) {
        expect(res.statusCode).to.equal(401);
        done();
      });
    });

    it('should return 200 if valid and set SID', function(done) {
      request.post({url: hrefBase + '/login', body: 'test'}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.have.property('set-cookie');
        expect(res.headers['set-cookie'].join('|')).to.include('SID');
        done();
      });
    });
  });

  describe('Logout', function() {
    it('should return 401 if not logged in', function(done) {
      request.post(hrefBase + '/logout', function(err, res, body) {
        expect(res.statusCode).to.equal(401);
        headers = res.headers['set-cookie'];
        done();
      });
    });
  });
});
