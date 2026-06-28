/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

/**
 * Handle requests to undefined routes.
 */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

/**
 * Centralized error handler — returns consistent JSON error responses.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation errors (schema-level)
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");

    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Invalid MongoDB ObjectId format
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 && !err.isOperational
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
