import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shared/ui/chart';
import { formatShare } from '../model/analytics-format';
import { ChartTooltipRow } from './chart-tooltip-row';

export interface ShareBarPart {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface ShareBarProps {
  title: string;
  parts: ShareBarPart[];
}

/** One bar split into the shares of its parts, with a legend that gives the count and the percent of each. */
export function ShareBar({ title, parts }: ShareBarProps) {
  const total = parts.reduce((sum, part) => sum + part.count, 0);
  const config = Object.fromEntries(
    parts.map((part) => [part.key, { label: part.label, color: part.color }]),
  ) satisfies ChartConfig;
  const row = { name: title, ...Object.fromEntries(parts.map((part) => [part.key, part.count])) };
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ChartContainer config={config} className="aspect-auto h-8 w-full">
        <BarChart data={[row]} layout="vertical" stackOffset="expand" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis type="number" hide domain={[0, 1]} />
          <YAxis type="category" dataKey="name" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => {
                  const part = parts.find((candidate) => candidate.key === name);
                  return (
                    <ChartTooltipRow
                      color={part?.color ?? 'var(--chart-4)'}
                      label={part?.label ?? String(name)}
                      value={`${value} · ${formatShare({ part: Number(value), total })}`}
                    />
                  );
                }}
              />
            }
          />
          {parts.map((part) => (
            <Bar
              key={part.key}
              dataKey={part.key}
              stackId="share"
              fill={`var(--color-${part.key})`}
              stroke="var(--card)"
              strokeWidth={2}
              radius={4}
            />
          ))}
        </BarChart>
      </ChartContainer>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {parts.map((part) => (
          <li key={part.key} className="flex items-center gap-1.5">
            <span className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: part.color }} aria-hidden />
            {part.label}
            <span className="text-muted-foreground tabular-nums">{formatShare({ part: part.count, total })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
