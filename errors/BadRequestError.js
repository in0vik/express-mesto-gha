class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'badRequest';
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
