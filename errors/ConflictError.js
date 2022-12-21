class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'conflict';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
