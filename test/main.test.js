
'use strict';

// Modules
require('should');

// Subject
var controller_response = require('../lib/index.js');

describe('Controller - Response', function () {

  describe('.ok()', function () {

    var next = function () {};

    it('should return a 200 status code', function () {
      var res = {
        locals : {},
        send   : function (status, data) {
          status.should.equal(200);
        }
      };
      controller_response.ok({}, res, next);
    });

    it('should send JSON version of res.locals', function () {
      var res = {
        locals : { key : 'value', some : 'data' },
        send   : function (status, data) {
          data.should.have.property('key').and.equal('value');
          data.should.have.property('some').and.equal('data');
        }
      };
      controller_response.ok({}, res, next);
    });

    it('should run the callback when finished', function (done) {
      var res = {
        locals : {},
        send   : function () {}
      };
      controller_response.ok({}, res, done);
    });

  });

  describe('.not_found()', function () {

    it('should return a 404 status code when route not found', function () {

      controller_response.not_found({
        method : 'WALK',
        path   : '/less-traveled'
      }, {}, function (error) {
        error.should.be.type('object');
        error.should.have.property('name').and.equal('ErrorNotFound');
        error.should.have.property('type').and.equal('client');
        error.should.have.property('status').and.equal(404);
        error.should.have.property('message').and.equal('Resource was not found');

        error.should.have.property('data').and.be.type('object');
        error.data.should.have.property('method').and.equal('WALK');
        error.data.should.have.property('path').and.equal('/less-traveled');

      });

    });

  });

  describe('.failure()', function () {

    it('should return the error status code when set', function () {
      var error = new Error();
      error.status = 123;
      controller_response.failure(error, {}, {
        send : function (status, data) {
          status.should.equal(123);
        }
      });
    });

    it('should return a 500 status code by default', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        send : function (status, data) {
          status.should.equal(500);
        }
      });
    });

    it('should return a error object in the response body', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        send : function (status, data) {
          data.should.have.property('error').and.be.type('object');
        }
      });
    });

    it('should return the error type when present', function () {
      var error = new Error();
      error.type = 'something';
      controller_response.failure(error, {}, {
        send : function (status, data) {
          data.error.should.have.property('type').and.equal('something');
        }
      });
    });

    it('should return a "server" error type by default', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        send : function (status, data) {
          data.error.should.have.property('type').and.equal('server');
        }
      });
    });

    it('should not have a data property by default', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        send : function (status, data) {
          data.error.should.not.have.property('data');
        }
      });
    });

    it('should send the error data when present', function () {
      var error = new Error();
      error.data = 'some-data';
      controller_response.failure(error, {}, {
        send : function (status, data) {
          data.error.should.have.property('data').and.equal('some-data');
        }
      });
    });

  });

});
