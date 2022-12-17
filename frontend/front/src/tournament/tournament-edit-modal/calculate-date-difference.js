export const calculateDateDifference = (startDate, endDate) =>
  12 * (Number(endDate.substring(0, 4)) - Number(startDate.substring(0, 4))) +
  Number(endDate.substring(5, 7)) -
  Number(startDate.substring(5, 7));
