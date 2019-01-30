const ALTER_NUM = 6;
const WARNING_COLOR = 'rgb(253, 152, 0)';
export const RED_COLOR = 'red';
const BLACK_COLOR = 'black';
export const GREEN_COLOR = 'green';

export const EMPTY_SYMBOL = '-';
export const displayDelayContent = param => {
  if (param || param === 0) {
    const value = parseInt(param);
    return value > 0 ? `+${value}` : value.toString();
  }
  return EMPTY_SYMBOL;
};

export const displayColor = delayHours => {
  const value = parseInt(delayHours);
  if (value > 0) {
    return value < ALTER_NUM ? WARNING_COLOR : RED_COLOR;
  }
  return BLACK_COLOR;
};
