class FrobiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'frobidden';
    this.statusCode = 403;
  }
}

module.exports = FrobiddenError;
