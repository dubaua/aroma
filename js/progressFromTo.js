function progressFromTo(progress, from, to) {
  if (typeof from !== 'number' || from < 0 || from > 1) {
    throw new TypeError(`progressFromTo: from is required number in range 0..1, got ${typeof from} ${from}`);
  }
  if (typeof to !== 'number' || to < 0 || to > 1) {
    throw new TypeError(`progressFromTo: to is required number in range 0..1, got ${typeof to} ${to}`);
  }
  if (typeof progress !== 'number' || progress < 0 || progress > 1) {
    throw new TypeError(
      `progressFromTo: progress is required number in range 0..1, got ${typeof progress} ${progress}`
    );
  }
  if (from > to) {
    throw new TypeError(`progressFromTo: from should be lesser than to, got ${from} > ${to}`);
  }

  return Math.min(Math.max(progress - from, 0) / (to - from), 1);
}

export default progressFromTo;
