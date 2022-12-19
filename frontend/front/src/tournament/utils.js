export const isStartDateEarlier = (startDate, endDate) => {
  return new Date(startDate).getTime() < new Date(endDate).getTime();
};
