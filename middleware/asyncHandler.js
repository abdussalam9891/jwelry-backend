
// Wraps an async controller so a rejected promise becomes a proper
// error response instead of an unhandled rejection / hung request.
// Scoped to the CMS module for now  
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  });
};
