/* eslint-disable no-unused-vars */
class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = ErrorNotFound;
