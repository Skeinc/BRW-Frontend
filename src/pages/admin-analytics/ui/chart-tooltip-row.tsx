interface ChartTooltipRowProps {
  color: string;
  label: string;
  value: string;
}

/** One line of a chart tooltip: a color mark, the name and the value. */
export function ChartTooltipRow({ color, label, value }: ChartTooltipRowProps) {
  return (
    <>
      <span className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} aria-hidden />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto pl-3 font-medium tabular-nums">{value}</span>
    </>
  );
}
