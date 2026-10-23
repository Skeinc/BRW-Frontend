/** Colour names of the catalogue, most specific first: a finish or a tint wins over the plain colour or the wood. */
const SWATCHES: readonly (readonly [RegExp, string])[] = [
  [/сонома|sonoma/, '#d9b99b'],
  [/венге|wenge/, '#3b2a22'],
  [/орех|walnut/, '#8a5a3b'],
  [/графит|graphite/, '#4a4a4a'],
  [/беж|beige/, '#e8d8bd'],
  [/корич|brown|карыч/, '#7a4e32'],
  [/сер(ый|ая|ое|ые)|grey|gray|шэр/, '#c3c3c0'],
  [/ч[её]рн|black|чорн/, '#171717'],
  [/(^|[^а-яё])бел|white/, '#f4f4f1'],
  [/дуб|oak/, '#b98a5e'],
];

/** CSS colour for a colour name from the catalogue, or `null` when the name is not known. */
export function getColorSwatch(name: string): string | null {
  const lower = name.toLowerCase();
  return SWATCHES.find(([pattern]) => pattern.test(lower))?.[1] ?? null;
}
