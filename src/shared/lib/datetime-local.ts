const pad = (value: number): string => String(value).padStart(2, '0');

/** ISO timestamp from the API as the value of an `<input type="datetime-local">` in the browser time zone. */
export function toDateTimeLocalValue(iso: string | null): string {
  if (iso === null) {
    return '';
  }
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** The value of a `datetime-local` input as an ISO timestamp for the API; blank gives `undefined`. */
export function fromDateTimeLocalValue(value: string): string | undefined {
  return value === '' ? undefined : new Date(value).toISOString();
}
