
'use strict';

// Modules
var errors = require('otto-errors');

module.exports = {

  end : function (req, res, next) {
    // We are done
    // Don't call next()
  },

  stub : function (data) {
    return function (req, res, next) {
      res.locals = data;
      next();
    };
  },

  ok : function (req, res, next) {
    res.status(200).send(res.locals);
    next();
  },

  created : function (req, res, next) {
    res.status(201).send(res.locals);
    next();
  },

  redirect : function (url) {
    return function (req, res, next) {
      res.redirect(url);
      next();
    };
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
    res.status(error.status).send({ error : error_to_send });

    // Do not call next()
    // unless you have another middleware ready
    // to handle this and/or send to a service
    // next(error);

  },

  assign : function (key, res, next) {
    return function (error, output) {
      if (error) { return next(error); }
      res.locals[key] = output;
      next();
    };
  }

};
