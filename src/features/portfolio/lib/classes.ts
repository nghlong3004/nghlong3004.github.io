// The imported Kokonut components use conditional class strings, with no caller overrides.
export function cn(...values: (string | false | undefined)[]) {
  return values.filter(Boolean).join(' ')
}
