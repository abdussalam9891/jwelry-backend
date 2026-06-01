router.delete(
  "/reviews/:reviewId",

  protect,

  authorize("admin"),

  deleteReviewAdmin
);
