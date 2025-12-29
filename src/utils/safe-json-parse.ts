export function safeJsonParse<T = Record<string, unknown>>(
  value: string,
  fallback: T = {} as T,
): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
