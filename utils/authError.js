/* eslint-disable no-unused-vars */
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = AuthError;
