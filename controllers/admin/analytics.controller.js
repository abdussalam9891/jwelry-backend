import { getDashboardAnalytics } from "../../service/analytics/dashboard.service.js";
import { getRevenueAnalytics } from "../../service/analytics/revenue.service.js";
import { getOrderAnalytics } from "../../service/analytics/orders.service.js";
import { getTopProducts } from "../../service/analytics/products.service.js";
import { getCustomerAnalytics } from "../../service/analytics/customers.service.js";
import { getPaymentAnalytics } from "../../service/analytics/payments.service.js";
import { getInventoryAnalytics } from "../../service/analytics/inventory.service.js";
import { getGeoRevenue } from "../../service/analytics/geo.service.js";
import { getMaterialAnalytics } from "../../service/analytics/materialAnalytics.service.js";
import { getCategoryAnalytics } from "../../service/analytics/categoryAnalytics.service.js";

import { parseDateRange } from "../../utils/admin/analytics/parseDateRange.js";

// demo role: mask real customer identity before it leaves the server
const redactRecentCustomers = (list = []) =>
  list.map((customer, i) => ({
    ...(customer.toObject ? customer.toObject() : customer),
    customerName: `Customer ${i + 1}`,
    customerEmail: "demo@example.com",
  }));

/* ---------------- DASHBOARD ---------------- */
export const getDashboardData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getDashboardAnalytics(
          startDate,
          endDate
        );

      if (req.user?.role === "demo" && data.customerAnalytics) {
        data.customerAnalytics.recentCustomers = redactRecentCustomers(
          data.customerAnalytics.recentCustomers
        );
      }

      res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

/* ---------------- REVENUE ---------------- */
export const getRevenueData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getRevenueAnalytics(
          startDate,
          endDate
        );

      res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };



  /* ---------------- MATERIALS ---------------- */

export const getMaterialsData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getMaterialAnalytics(
          startDate,
          endDate
        );

      res.json({
        success: true,
        materialAnalytics:
          data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };



  /* ---------------- CATEGORIES ---------------- */

export const getCategoriesData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getCategoryAnalytics(
          startDate,
          endDate
        );

      res.json({
        success: true,
        categoryAnalytics:
          data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };








/* ---------------- ORDERS ---------------- */
export const getOrdersData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getOrderAnalytics(
          startDate,
          endDate
        );

      res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

/* ---------------- TOP PRODUCTS ---------------- */
export const getProductsData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getTopProducts(
          startDate,
          endDate
        );

      res.json({
        success: true,
        topProducts:
          data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

/* ---------------- CUSTOMERS ---------------- */
export const getCustomersData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getCustomerAnalytics(
          startDate,
          endDate
        );

      if (req.user?.role === "demo") {
        data.recentCustomers = redactRecentCustomers(data.recentCustomers);
      }

      res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

/* ---------------- PAYMENTS ---------------- */
export const getPaymentsData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getPaymentAnalytics(
          startDate,
          endDate
        );

      res.json({
        success: true,
        paymentAnalytics:
          data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

/* ---------------- INVENTORY ---------------- */
export const getInventoryData =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await getInventoryAnalytics();

      res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

/* ---------------- GEO ---------------- */
export const getGeoData =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } =
        parseDateRange(
          req.query
        );

      const data =
        await getGeoRevenue(
          startDate,
          endDate
        );

      res.json({
        success: true,
        geoRevenue:
          data,
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };
