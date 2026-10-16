type QueryValue = string | number | boolean | undefined;

/** `?a=1&b=x` for the defined values (an empty string value is kept), or an empty string when there are none. */
export function toQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}
