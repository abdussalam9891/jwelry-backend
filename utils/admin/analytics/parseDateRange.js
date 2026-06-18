export const parseDateRange = (
  query = {}
) => {

  const {
    startDate,
    endDate,
    from,
    to,
  } = query;

  const start =
    startDate || from;

  const end =
    endDate || to;

  const now =
    new Date();

  let parsedStartDate;
  let parsedEndDate;

  if (
    start &&
    end
  ) {

    parsedStartDate =
      new Date(start);

    parsedEndDate =
      new Date(end);

  } else {

    parsedStartDate =
      new Date();

    parsedStartDate.setMonth(
      now.getMonth() - 12
    );

    parsedEndDate =
      new Date();

  }

  /* START OF DAY */

  parsedStartDate.setHours(
    0,
    0,
    0,
    0
  );

  /* END OF DAY */

  parsedEndDate.setHours(
    23,
    59,
    59,
    999
  );

  return {
    startDate:
      parsedStartDate,

    endDate:
      parsedEndDate,
  };

};
