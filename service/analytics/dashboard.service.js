import { getSmartInsights } from "../../utils/admin/analytics/smartInsights.js";

import { getCustomerAnalytics } from "./customers.service.js";
import { getGeoRevenue } from "./geo.service.js";
import { getInventoryAnalytics } from "./inventory.service.js";
import { getOrderAnalytics } from "./orders.service.js";
import { getPaymentAnalytics } from "./payments.service.js";
import { getTopProducts } from "./products.service.js";
import { getRevenueAnalytics } from "./revenue.service.js";

import { getMaterialAnalytics } from "./materialAnalytics.service.js";
import { getCategoryAnalytics } from "./categoryAnalytics.service.js";
import { getHealthScore } from "./healthScore.service.js";

export const getDashboardAnalytics = async (
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
    materials,
    categories,
  ] = await Promise.all([
    getRevenueAnalytics(startDate, endDate),

    getOrderAnalytics(startDate, endDate),

    getTopProducts(startDate, endDate),

    getCustomerAnalytics(startDate, endDate),

    getPaymentAnalytics(startDate, endDate),

    getInventoryAnalytics(),

    getGeoRevenue(startDate, endDate),

    getMaterialAnalytics(startDate, endDate),

    getCategoryAnalytics(startDate, endDate),
  ]);

  const cod =
    payments.find(
      (p) => p.name === "COD"
    )?.value || 0;

  const smartInsights =
    getSmartInsights({
      revenue: revenue.totalRevenue,

      lowStockProducts:
        inventory.lowStock,

      cancelledOrders:
        orders.cancelledOrders,

      repeatCustomers:
        customers.repeatCustomers,

      codPercentage: cod,
    });

  const healthScore =
    getHealthScore({
      revenue:
        revenue.totalRevenue,

      cancelledOrders:
        orders.cancelledOrders,

      lowStockProducts:
        inventory.lowStock,

      repeatCustomers:
        customers.repeatCustomers,
    });

  return {
    ...revenue,

    ...orders,

    topProducts: products,

    customerAnalytics:
      customers,

    paymentAnalytics:
      payments,

    inventoryHealth:
      inventory,

    geoRevenue: geo,

    materialAnalytics:
      materials,

    categoryAnalytics:
      categories,

    healthScore,

    smartInsights,
  };
};
