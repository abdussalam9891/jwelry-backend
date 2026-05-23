export const parseDateRange = (query = {}) => {
  const { from, to } = query;

  const now = new Date();

  let startDate;
  let endDate;

  if (from && to) {
    startDate = new Date(from);
    endDate = new Date(to);
  } else {
    startDate = new Date();
    startDate.setMonth(
      now.getMonth() - 12
    );

    endDate = now;
  }

  /* START OF DAY */
  startDate.setHours(
    0,
    0,
    0,
    0
  );

  /* END OF DAY */
  endDate.setHours(
    23,
    59,
    59,
    999
  );

  return {
    startDate,
    endDate,
  };
};
