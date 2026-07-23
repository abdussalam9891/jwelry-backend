export const validateRequest =
  ({ body, params, query }) =>
  async (req, res, next) => {
    try {
      if (body) {
        req.body = await body.parseAsync(req.body);
      }

      if (params) {
        req.params = await params.parseAsync(req.params);
      }

      if (query) {
        req.query = await query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.errors,
      });
    }
  };
