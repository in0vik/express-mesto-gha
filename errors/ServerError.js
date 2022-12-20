class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'serverError';
    this.statusCode = 500;
  }
}

module.exports = ServerError;
