class APIError extends Error {
  constructor(message, statusCode = 500, operational = true) {
    this.httpStatusCode = statusCode;
    this.message = message;
    this.isOperational = operational;
  }
}
module.exports = { APIError };
