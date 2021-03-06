type BaseTick = number | string;

const processTicks = <T extends BaseTick>(
  tickValues: T[],
  ticks: number
): T[] => {
  const result = [] as T[];

  const len = tickValues.length;

  if (ticks === 0 || len === 0) {
    return result;
  }

  for (let i = 0; i < tickValues.length; i += Math.floor(len / ticks)) {
    result.push(tickValues[i]);
  }

  return result;
};

const processTicksByMax = (maxValue: number, ticks: number): number[] => {
  const result = [] as number[];

  if (maxValue === -Infinity || maxValue === Infinity || !maxValue)
    return result;

  for (let i = 0; i <= ticks; i++) {
    result.push((maxValue / ticks) * i);
  }

  return result;
};

export { processTicks, processTicksByMax };
