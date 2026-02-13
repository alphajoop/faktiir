export const easing = {
  smooth: [0.16, 1, 0.3, 1],
  accelerate: [0.4, 0, 1, 1],
  decelerate: [0, 0, 0.2, 1],
} as const;

export const duration = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
} as const;
