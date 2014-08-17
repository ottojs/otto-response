
'use strict';

// Modules
require('should');

// Subject
var controller_response = require('../lib/index.js');

describe('Controller - Response', function () {

  describe('.end()', function () {

    it('should not call next()', function (done) {

      var called = false;
      controller_response.end({}, {}, function () {
        called = true;
      });

      process.nextTick(function () {
        called.should.equal(false);
        done();
      });

    });

  });

  describe('.stub()', function () {

    it('should set res.locals to provided data', function () {

      // Function 1
      var res1 = { locals : {} };
      var fn1 = controller_response.stub({ key : 'one' });
      fn1({}, res1, function () {
        res1.locals.should.eql({ key : 'one' });
      });

      // Function 2
      var res2 = { locals : {} };
      var fn2 = controller_response.stub({ key : 'two' });
      fn2({}, res2, function () {
        res2.locals.should.eql({ key : 'two' });
      });

    });

  });

  describe('.ok()', function () {

    var next = function () {};

    it('should return a 200 status code', function () {
      var res = {
        locals : {},
        status : function (status) {
          status.should.equal(200);
          return {
            send : function (data) {}
          };
        }
      };
      controller_response.ok({}, res, next);
    });

    it('should send JSON version of res.locals', function () {
      var res = {
        locals : { key : 'value', some : 'data' },
        status : function (status) {
          return {
            send : function (data) {
              data.should.have.property('key').and.equal('value');
              data.should.have.property('some').and.equal('data');
            }
          };
        }
      };
      controller_response.ok({}, res, next);
    });

    it('should run the callback when finished', function (done) {
      var res = {
        locals : {},
        status : function (status) {
          return {
            send : function (data) {}
          };
        }
      };
      controller_response.ok({}, res, done);
    });

  });

  describe('.created()', function () {

    var next = function () {};

    it('should return a 201 status code', function () {
      var res = {
        locals : {},
        status : function (status) {
          status.should.equal(201);
          return {
            send : function (data) {}
          };
        }
      };
      controller_response.created({}, res, next);
    });

    it('should send JSON version of res.locals', function () {
      var res = {
        locals : { win : 'lose', some : 'data' },
        status : function (status) {
          return {
            send : function (data) {
              data.should.have.property('win').and.equal('lose');
              data.should.have.property('some').and.equal('data');
            }
          };
        }
      };
      controller_response.created({}, res, next);
    });

    it('should run the callback when finished', function (done) {
      var res = {
        locals : {},
        status : function (status) {
          return {
            send : function (data) {}
          };
        }
      };
      controller_response.created({}, res, done);
    });

  });

  describe('.not_found()', function () {

    it('should return an ErrorNotFound error when called', function () {

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
        status : function (status) {
          status.should.equal(123);
          return {
            send : function (data) {}
          };
        }
      });
    });

    it('should return a 500 status code by default', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        status : function (status) {
          status.should.equal(500);
          return {
            send : function (data) {}
          };
        }
      });
    });

    it('should return a error object in the response body', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        status : function (status) {
          return {
            send : function (data) {
              data.should.have.property('error').and.be.type('object');
            }
          };
        }
      });
    });

    it('should return the error type when present', function () {
      var error = new Error();
      error.type = 'something';
      controller_response.failure(error, {}, {
        status : function (status) {
          return {
            send : function (data) {
              data.error.should.have.property('type').and.equal('something');
            }
          };
        }
      });
    });

    it('should return a "server" error type by default', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        status : function (status) {
          return {
            send : function (data) {
              data.error.should.have.property('type').and.equal('server');
            }
          };
        }
      });
    });

    it('should not have a data property by default', function () {
      var error = new Error();
      controller_response.failure(error, {}, {
        status : function (status) {
          return {
            send : function (data) {
              data.error.should.not.have.property('data');
            }
          };
        }
      });
    });

    it('should send the error data when present', function () {
      var error = new Error();
      error.data = 'some-data';
      controller_response.failure(error, {}, {
        status : function (status) {
          return {
            send : function (data) {
              data.error.should.have.property('data').and.equal('some-data');
            }
          };
        }
      });
    });

  });

  describe('.assign()', function () {

    it('should assign output to res.locals[key]', function () {
      var res = { locals : {} };
      var assign = controller_response.assign('key', res, function (error) {
        (error === undefined).should.equal(true);
        res.locals.should.have.property('key').and.eql({ object : 'data' });
      });
      assign(undefined, { object : 'data' });
    });

    it('should return an error when one is passed', function () {
      var assign = controller_response.assign('key', {}, function (error) {
        error.should.have.property('name').and.equal('Error');
        error.should.have.property('message').and.equal('Passed Error');
      });
      assign(new Error('Passed Error'));
    });

  });

});
