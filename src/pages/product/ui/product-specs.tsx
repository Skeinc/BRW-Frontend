interface ProductSpecsProps {
  rows: readonly (readonly [string, string])[];
}

export function ProductSpecs({ rows }: ProductSpecsProps) {
  return (
    <dl className="divide-y border-y">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 py-3 text-sm">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
