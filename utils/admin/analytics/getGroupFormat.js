export const getGroupFormat = (
  startDate,
  endDate
) => {
  const diffInDays =
    Math.ceil(
      (endDate - startDate) /
        (1000 * 60 * 60 * 24)
    );

  if (diffInDays <= 31) {
    return "%d %b";
  }

  if (diffInDays <= 365) {
    return "%b";
  }

  return "%Y";
};
