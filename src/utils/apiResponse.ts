export const ok = <T>(data: T, meta?: Record<string, unknown>) => ({
  success: true,
  data,
  ...(meta ? { meta } : {}),
});

export const created = <T>(data: T) => ({
  success: true,
  data,
});