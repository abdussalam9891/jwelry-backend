import { body, validationResult } from "express-validator";

export const validateHeroBannerCreate = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

  body("navigationType")
    .notEmpty()
    .withMessage("Navigation type is required.")
    .isIn([
      "page",
      "category",
      "collection",
      "product",
      "external",
    ])
    .withMessage("Invalid navigation type."),

  body("navigationValue")
    .trim()
    .notEmpty()
    .withMessage("Navigation value is required."),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false."),

  body("startDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Invalid start date."),

  body("endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Invalid end date.")
    .custom((endDate, { req }) => {
      if (
        req.body.startDate &&
        new Date(endDate) < new Date(req.body.startDate)
      ) {
        throw new Error(
          "End date cannot be before start date."
        );
      }

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];
