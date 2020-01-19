export const formatNumber = number => {
  if ((number * 10) % 1 > 0) {
    return number.toFixed(2);
  }

  if (number % 1 > 0) {
    return number.toFixed(1);
  }

  return number;
};
