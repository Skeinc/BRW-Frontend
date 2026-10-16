/** Blank input means "no value": the API clears nullable fields with `null`. */
export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}
