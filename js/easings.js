export const linear = t => t;

export const easeInQuad = t => t * t;
export const easeOutQuad = t => t * (2 - t);
export const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export const easeInCubic = t => t * t * t;
export const easeOutCubic = t => --t * t * t + 1;
export const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

export const easeInQuart = t => t * t * t * t;
export const easeOutQuart = t => 1 - --t * t * t * t;
export const easeInOutQuart = t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t);

export const easeInQuint = t => t * t * t * t * t;
export const easeOutQuint = t => 1 + --t * t * t * t * t;
export const easeInOutQuint = t => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t);

export const easeInElastic = t => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
export const easeOutElastic = t => ((0.04 * t) / --t) * Math.sin(25 * t);
export const easeInOutElastic = t =>
  (t -= 0.5) < 0 ? (0.02 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;

export const easeInSin = t => 1 + Math.sin((Math.PI / 2) * t - Math.PI / 2);
export const easeOutSin = t => Math.sin((Math.PI / 2) * t);
export const easeInOutSin = t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;

export const easingCircIn = t => -(Math.sqrt(1 - t * t) - 1);
export const easingCircOut = t => Math.sqrt(1 - (t = t - 1) * t);
export const easingCircInOut = t =>
  (t *= 2) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);

export const easingExpIn = t => Math.pow(2, 10 * (t - 1)) - 0.001;
export const easingExpOut = t => 1 - Math.pow(2, -10 * t);
export const easingExpInOut = t =>
  (t *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (t - 1)) : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));

export const easingBackIn = (t, p = 1.70158) => t * t * ((p + 1) * t - p);
export const easingBackOut = (t, p = 1.70158) => --t * t * ((p + 1) * t + p) + 1;
export const easingBackInOut = (t, p = 1.70158) => {
  const s = p * 1.525;
  if ((t *= 2) < 1) {
    return 0.5 * (t * t * ((s + 1) * t - s));
  }
  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
};
