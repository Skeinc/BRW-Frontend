type QueryValue = string | number | boolean | readonly string[] | undefined;

/** `?a=1&b=x&c[]=1&c[]=2` for the defined values (an empty string value is kept), or an empty string when there are none. */
export function toQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }
    if (typeof value === 'object') {
      for (const item of value) {
        search.append(`${key}[]`, item);
      }
    } else {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}
