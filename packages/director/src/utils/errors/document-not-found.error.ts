class DocumentNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentNotFoundError";
  }
}

export { DocumentNotFoundError };
