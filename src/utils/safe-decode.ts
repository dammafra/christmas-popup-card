export function safeDecode<T = Record<string, unknown>>(value: string, fallback: T = {} as T): T {
  try {
    return JSON.parse(atob(value)) as T
  } catch {
    return fallback
  }
}
