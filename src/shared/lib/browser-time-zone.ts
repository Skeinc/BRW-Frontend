/** IANA name of the time zone of the browser, such as `Europe/Minsk`, or undefined when it can not be read. */
export function getBrowserTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}
