class ValidationError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
  }

  formatErrors() {
    return this.errors.map((item) => ({
      field: item.param,
      msg: item.msg,
    }));
  }
}

module.exports = { ValidationError };
