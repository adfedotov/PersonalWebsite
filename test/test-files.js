const expect = require('chai').expect;
const request = require('request');

const hrefBase = 'http://127.0.0.1:3000';

describe('Static Files Access', function() {
  it('CSS', function(done) {
    request(hrefBase + '/stylesheets/style.css', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('JavaScript', function(done) {
    request(hrefBase + '/javascripts/script.js', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('Images', function(done) {
    request(hrefBase + '/assets/images/background.jpg', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('Fonts', function(done) {
    request(hrefBase + '/assets/fonts/roboto-v20-latin-regular.woff', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('Resume', function(done) {
    request(hrefBase + '/assets/pdf/AndreiFedotovResume.pdf', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});
