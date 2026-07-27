import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/UserModel.js";


// Escapes regex special characters so user input is treated as a
// literal string to search for, never as regex syntax
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}



export const globalSearch = async (
  req,
  res
) => {
  try {
    const q =
      req.query.q
        ?.trim();

    if (!q) {
      return res.json({
        products: [],
        orders: [],
        customers: [],
      });
    }

      const safeQuery = q.slice(0, 100);
    const regex =
      new RegExp(
        escapeRegex(safeQuery),
        "i"
      );

    const [
      products,
      orders,
      customers,
    ] = await Promise.all([
      /* PRODUCTS */
      Product.find({
        $or: [
          {
            name: regex,
          },
          {
            slug: regex,
          },
          {
            sku: regex,
          },
          {
            category: regex,
          },
          {
            "variants.sku":
              regex,
          },
          {
            "variants.material":
              regex,
          },
        ],
      })
        .select(`
          name
          slug
          sku
          images
          category
        `)
        .limit(6),

      /* ORDERS */
      Order.find({
        $or: [
          {
            orderNumber:
              regex,
          },
          {
            customerName:
              regex,
          },
          {
            customerEmail:
              regex,
          },
          {
            customerPhone:
              regex,
          },
        ],
      })
        .select(`
          orderNumber
          customerName
          totalPrice
          paymentStatus
        `)
        .sort({
          createdAt: -1,
        })
        .limit(6),

      /* CUSTOMERS */
      User.find({
        $or: [
          {
            name: regex,
          },
          {
            email: regex,
          },
          {
            phone: regex,
          },
        ],
      })
        .select(`
          name
          email
          avatar
          role
        `)
        .limit(6),
    ]);

    return res.json({
      products,
      orders,
      customers,
    });
  } catch (error) {
    console.error(
      "GLOBAL SEARCH ERROR:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Search failed",
      });
  }
};
