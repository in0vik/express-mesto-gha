class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'unauthorized';
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
