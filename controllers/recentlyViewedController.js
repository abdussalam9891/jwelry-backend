import {
  saveRecentlyViewed,
  getRecentlyViewed,
  clearRecentlyViewed,
  mergeRecentlyViewed,
} from "../service/recentlyViewedService.js";

/**
 * GET
 * /api/v1/recently-viewed
 */

const getRecentlyViewedProducts = async (
  req,
  res
) => {
  try {
    const products =
      await getRecentlyViewed(
        req.user._id
      );

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * POST
 * /api/v1/recently-viewed/:productId
 */

const addRecentlyViewedProduct =
  async (req, res) => {
    try {
      const products =
        await saveRecentlyViewed(
          req.user._id,
          req.params.productId
        );

      res.json({
        success: true,
        message:
          "Recently viewed updated.",
        products,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

/**
 * DELETE
 * /api/v1/recently-viewed/clear
 */

const deleteRecentlyViewed =
  async (req, res) => {
    try {
      await clearRecentlyViewed(
        req.user._id
      );

      res.json({
        success: true,
        message:
          "Recently viewed cleared.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

/**
 * POST
 * /api/v1/recently-viewed/merge
 */

const mergeGuestRecentlyViewed =
  async (req, res) => {
    try {
      const {
        guestProductIds = [],
      } = req.body;

      const products =
        await mergeRecentlyViewed(
          req.user._id,
          guestProductIds
        );

      res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

export {
  getRecentlyViewedProducts,
  addRecentlyViewedProduct,
  deleteRecentlyViewed,
  mergeGuestRecentlyViewed,
};
