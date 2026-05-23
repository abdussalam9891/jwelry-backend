import { getRevenueAnalytics } from "./revenue.service.js";
import { getOrderAnalytics } from "./orders.service.js";
import { getTopProducts } from "./products.service.js";
import { getCustomerAnalytics } from "./customers.service.js";
import { getPaymentAnalytics } from "./payments.service.js";
import { getInventoryAnalytics } from "./inventory.service.js";
import { getGeoRevenue } from "./geo.service.js";
import { getSmartInsights } from "../../utils/admin/analytics/smartInsights.js";

export const getDashboardAnalytics =
  async (
    startDate,
    endDate
  ) => {
    const [
      revenue,
      orders,
      products,
      customers,
      payments,
      inventory,
      geo,
    ] =
      await Promise.all([
        getRevenueAnalytics(
          startDate,
          endDate
        ),
        getOrderAnalytics(
          startDate,
          endDate
        ),
        getTopProducts(
          startDate,
          endDate
        ),
        getCustomerAnalytics(
          startDate,
          endDate
        ),
        getPaymentAnalytics(
          startDate,
          endDate
        ),
        getInventoryAnalytics(),
        getGeoRevenue(
          startDate,
          endDate
        ),
      ]);

    const cod =
      payments.find(
        (p) =>
          p.name ===
          "COD"
      )?.value || 0;

    const smartInsights =
      getSmartInsights(
        {
          revenue:
            revenue.totalRevenue,
          lowStockProducts:
            inventory.lowStock,
          cancelledOrders:
            orders.cancelledOrders,
          repeatCustomers:
            customers.repeatCustomers,
          codPercentage:
            cod,
        }
      );

    return {
      ...revenue,
      ...orders,
      topProducts:
        products,
      customerAnalytics:
        customers,
      paymentAnalytics:
        payments,
      inventoryHealth:
        inventory,
      geoRevenue:
        geo,
      smartInsights,
    };
  };
