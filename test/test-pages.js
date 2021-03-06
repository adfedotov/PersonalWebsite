const expect = require('chai').expect;
const request = require('request');
const ejs = require('ejs');
const fs = require('fs');
const content = require('../util/content');

const hrefBase = 'http://127.0.0.1:3000';

describe('Status', function() {
  describe('Index page', function() {
    it('Index page status', function(done) {
      request(hrefBase, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe('Admin', function() {
    it('Login page', function(done) {
      request(hrefBase + '/admin', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('Edit page', function(done) {
      request({url: hrefBase + '/admin/edit', followRedirect: false}, function(err, res, body) {
        expect(res.statusCode).to.equal(302);
        done();
      });
    });
  });

  describe('PageNotFound', function() {
    it('Page Not Found status', function(done) {
      request(hrefBase + '/foobar', function(err, res, body) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });
});

describe('Content', function() {
  let html = '';

  describe('Index page', function() {
    it('Content is valid', function(done) {
      html = ejs.render(fs.readFileSync('./views/index.ejs', 'utf-8'), content());
      request(hrefBase, function(err, res, body) {
        expect(body).to.equal(html);
      });
      done();
    });
  });
});
