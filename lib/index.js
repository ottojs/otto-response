
'use strict';

// Modules
var errors = require('otto-errors');

module.exports = {

  end : function (req, res, next) {
    // We are done
    // Don't call next()
  },

  ok : function (req, res, next) {
    res.send(200, res.locals);
    next();
  },

  created : function (req, res, next) {
    res.send(201, res.locals);
    next();
  },

  // No Route Found?
  // Use this middleware
  not_found : function (req, res, next) {
    next(new errors.ErrorNotFound('Resource was not found', req));
  },

  // Always keep this as the last middleware
  // It uses 4 arguments to signify it is an error handler
  failure : function (error, req, res, next) {

    // Default properties
    if (!error.status) { error.status = 500; }
    if (!error.type) { error.type = 'server'; }

    // Compose information sent back
    // We may not want to send everything
    // in the error for security/privacy reasons
    var error_to_send = {
      type    : error.type,
      name    : error.name,
      message : error.message
    };

    // Add data if present
    if (error.data) { error_to_send.data = error.data; }

    // Respond
    res.send(error.status, {
      error : error_to_send
    });

    // Do not call next()
    // unless you have another middleware ready
    // to handle this and/or send to a service
    // next(error);

  }

};
