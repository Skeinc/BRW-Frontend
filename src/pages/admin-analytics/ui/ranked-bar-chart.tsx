import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import { cn } from '@/shared/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shared/ui/chart';
import { ChartTooltipRow } from './chart-tooltip-row';

export interface RankedBarRow {
  id: string;
  label: string;
  value: number;
  /** Text at the end of the bar, for example the formatted money. */
  valueLabel: string;
  /** 1 for a root, more for a nested row; nested labels are dimmed and marked with an arrow. */
  depth?: number;
}

const DEFAULT_LABEL_WIDTH = 190;
const ROW_HEIGHT = 36;
/** Average width of a character of the 12px label, to cut a long label to the width of the axis. */
const LABEL_CHAR_WIDTH = 7.8;
const VALUE_LABEL_SPACE = 92;

interface RankedTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  rows: RankedBarRow[];
  maxChars: number;
  onRowClick?: (id: string) => void;
}

function RankedTick({ x = 0, y = 0, payload, rows, maxChars, onRowClick }: RankedTickProps) {
  const row = rows.find((candidate) => candidate.id === payload?.value);
  if (!row) {
    return null;
  }
  const isNested = (row.depth ?? 1) > 1;
  const text = row.label.length > maxChars ? `${row.label.slice(0, maxChars - 1)}…` : row.label;
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      className={cn(
        isNested ? 'fill-muted-foreground text-xs' : 'fill-foreground text-xs font-semibold',
        onRowClick && 'cursor-pointer hover:underline',
      )}
      role={onRowClick ? 'link' : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onClick={onRowClick ? () => onRowClick(row.id) : undefined}
      onKeyDown={
        onRowClick
          ? (event) => {
              if (event.key === 'Enter') {
                onRowClick(row.id);
              }
            }
          : undefined
      }
    >
      <title>{row.label}</title>
      {isNested ? `› ${text}` : text}
    </text>
  );
}

interface RankedBarChartProps {
  rows: RankedBarRow[];
  /** CSS color of the bars. */
  color: string;
  /** Width of the label column; a narrow card uses less. */
  labelWidth?: number;
  /** Makes the labels and bars clickable; gets the id of the row. */
  onRowClick?: (id: string) => void;
}

/** Horizontal bars sorted by the caller, one row each, with the label on the left and the value at the bar end. */
export function RankedBarChart({ rows, color, labelWidth = DEFAULT_LABEL_WIDTH, onRowClick }: RankedBarChartProps) {
  const config = { value: { label: '', color } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height: rows.length * ROW_HEIGHT + 8 }}>
      <BarChart data={rows} layout="vertical" margin={{ left: 0, right: VALUE_LABEL_SPACE, top: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="id"
          width={labelWidth}
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={<RankedTick rows={rows} maxChars={Math.floor(labelWidth / LABEL_CHAR_WIDTH)} onRowClick={onRowClick} />}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(_value, _name, item) => (
                <ChartTooltipRow
                  color={color}
                  label={String((item.payload as RankedBarRow).label)}
                  value={String((item.payload as RankedBarRow).valueLabel)}
                />
              )}
            />
          }
        />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[0, 4, 4, 0]}
          barSize={14}
          className={onRowClick ? 'cursor-pointer' : undefined}
          onClick={onRowClick ? (bar) => onRowClick(String((bar.payload as Partial<RankedBarRow>).id)) : undefined}
        >
          <LabelList dataKey="valueLabel" position="right" className="fill-foreground text-xs font-medium" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
