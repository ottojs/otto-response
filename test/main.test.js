
'use strict';

// Modules
require('should');

// Subject
var controller_response = require('../lib/index.js');

describe('Controller - Response', function () {

  describe('.success()', function () {

    it('should return a 200 status code when sending JSON', function () {
      var res = {
        locals : {},
        send   : function (status, data) {
          status.should.equal(200);
        }
      };
      controller_response.success({}, res);
    });

    it('should send JSON version of res.locals by default', function () {
      var res = {
        locals : { key : 'value', some : 'data' },
        send   : function (status, data) {
          data.should.have.property('key').and.equal('value');
          data.should.have.property('some').and.equal('data');
        }
      };
      controller_response.success({}, res);
    });

    it('should render a view when res.locals._view is set', function () {
      var res = {
        locals : { _view : 'myview' },
        render : function (view) {
          view.should.equal('myview');
        }
      };
      controller_response.success({}, res);
    });

    it('should provide res.locals data to view when rendering', function () {
      var res = {
        locals : { _view : 'myview', key : 'value', some : 'data' },
        render : function (view, data) {
          data.should.have.property('key').and.equal('value');
          data.should.have.property('some').and.equal('data');
        }
      };
      controller_response.success({}, res);
    });

    it('should delete res.locals._view before rendering', function () {
      var res = {
        locals : { _view : 'myview', key : 'value' },
        render : function (view, data) {
          data.should.not.have.property('_view');
        }
      };
      controller_response.success({}, res);
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
