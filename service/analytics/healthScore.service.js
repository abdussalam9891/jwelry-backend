export const getHealthScore = ({
  revenue,
  cancelledOrders,
  lowStockProducts,
  repeatCustomers,
}) => {
  let score = 100;

  if (cancelledOrders > 20)
    score -= 20;

  if (lowStockProducts > 10)
    score -= 10;

  if (repeatCustomers > 20)
    score += 5;

  if (revenue < 100000)
    score -= 10;

  score = Math.max(
    0,
    Math.min(score, 100)
  );

  let status = "Excellent";

  if (score < 80)
    status = "Healthy";

  if (score < 60)
    status = "Warning";

  if (score < 40)
    status = "Critical";

  return {
    score,
    status,
  };
};
