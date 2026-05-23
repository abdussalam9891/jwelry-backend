export const getSmartInsights = ({
  revenue,
  lowStockProducts,
  cancelledOrders,
  repeatCustomers,
  codPercentage,
}) => {
  const insights = [];

  if (revenue > 0) {
    insights.push(
      `Revenue generated ₹${revenue.toLocaleString(
        "en-IN"
      )}`
    );
  }

  if (lowStockProducts > 0) {
    insights.push(
      `${lowStockProducts} products low in stock`
    );
  }

  if (cancelledOrders > 0) {
    insights.push(
      `${cancelledOrders} cancelled orders detected`
    );
  }

  if (repeatCustomers > 0) {
    insights.push(
      `${repeatCustomers} repeat customers found`
    );
  }

  if (codPercentage > 40) {
    insights.push(
      `COD orders are unusually high (${codPercentage}%)`
    );
  }

  if (!insights.length) {
    insights.push(
      "No major anomalies detected"
    );
  }

  return insights;
};
