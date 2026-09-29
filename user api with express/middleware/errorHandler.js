function errorHandler(err, req, res, next) {
  console.error(err);

  // Invalid JSON
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

module.exports = errorHandler;
