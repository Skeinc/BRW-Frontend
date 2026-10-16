import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { Fragment, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { DataTableEmptyState } from './data-table-empty-state';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Skeleton } from './skeleton';
import { Spinner } from './spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { cn } from '@/shared/lib/utils';
import { DataTableSortableRow } from './data-table-sortable-row';
import { DisabledWithTooltip } from './disabled-with-tooltip';

const DEFAULT_PAGE_SIZES = [10, 25, 50] as const;
/** Viewport always fits header + this many body rows; more rows scroll inside. */
const VIEWPORT_BODY_ROWS = 10;
/** Header uses TableHead `h-10` (2.5rem). Body rows are taller for badges/actions. */
const HEADER_ROW_CLASS = 'h-10';
const BODY_ROW_CLASS = 'h-12';
const BODY_CELL_CLASS = 'h-12 py-0';
const BODY_VIEWPORT_CLASS = 'h-[calc(2.5rem+10*3rem)]';
const BODY_FILL_HEIGHT_CLASS = 'h-[calc(10*3rem)]';
export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

export type DataTableAction<T> = {
  id: string;
  label: ReactNode | ((row: T) => ReactNode);
  onSelect: (row: T) => void;
  icon?: LucideIcon;
  getIcon?: (row: T) => LucideIcon;
  loading?: boolean | ((row: T) => boolean);
  disabled?: boolean | ((row: T) => boolean);
  /** Shown as a tooltip while the action is disabled, so the user knows why. */
  disabledReason?: ReactNode | ((row: T) => ReactNode);
  variant?: 'default' | 'destructive';
  hidden?: (row: T) => boolean;
  separatorBefore?: boolean | ((row: T) => boolean);
};

export type DataTableActionsConfig<T> = {
  items: DataTableAction<T>[];
  menuLabel?: ReactNode;
};

export type DataTableEmptyConfig = {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
};

type DataTablePaginationBase = {
  page: number;
  pageSize: number;
  pageSizes?: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export type DataTablePaginationConfig =
  | (DataTablePaginationBase & { mode: 'server'; total: number })
  | (DataTablePaginationBase & { mode: 'client'; total?: never });

export type DataTableReorderConfig<T> = {
  /** False while sorting is unavailable (search or filter active): the handles stay visible but disabled. */
  enabled: boolean;
  handleLabel: string;
  disabledReason?: ReactNode;
  /** Rows can only be dropped among rows with the same key, for example siblings of one parent. */
  getGroupKey?: (row: T) => string;
  onReorder: (activeId: string, overId: string) => void;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Initial load — replace body with skeletons. */
  isLoading?: boolean;
  /** Refetch while previous rows stay visible — dim body without layout jump. */
  isRefreshing?: boolean;
  error?: ReactNode;
  empty?: DataTableEmptyConfig;
  actions?: false | DataTableActionsConfig<T>;
  pagination?: false | DataTablePaginationConfig;
  skeletonRows?: number;
  /** Drag-and-drop sorting of rows. */
  reorder?: DataTableReorderConfig<T>;
  /** Stretch to the bottom of the screen; the parent must be a flex column with a bounded height. */
  fillHeight?: boolean;
};

function resolveActionFlag<T>(value: boolean | ((row: T) => boolean) | undefined, row: T): boolean {
  if (typeof value === 'function') {
    return value(row);
  }
  return Boolean(value);
}

function resolveActionReason<T>(reason: DataTableAction<T>['disabledReason'], row: T): ReactNode {
  return typeof reason === 'function' ? reason(row) : reason;
}

function resolveActionIcon<T>(item: DataTableAction<T>, row: T): LucideIcon | undefined {
  if (item.getIcon) {
    return item.getIcon(row);
  }
  return item.icon;
}

function DataTablePagination({
  page,
  pageSize,
  total,
  pageSizes,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  pageSizes: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const { t } = useTranslation();
  const pageSizeId = useId();
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
      <div className="flex items-center gap-2">
        <Label htmlFor={pageSizeId} className="text-sm font-medium">
          {t('table.pagination.pageSize')}
        </Label>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger size="sm" className="w-20" id={pageSizeId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizes.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm font-medium">{t('table.pagination.page', { page, totalPages })}</div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          <span className="sr-only">{t('table.pagination.first')}</span>
          <ChevronsLeft />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <span className="sr-only">{t('table.pagination.previous')}</span>
          <ChevronLeft />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="sr-only">{t('table.pagination.next')}</span>
          <ChevronRight />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <span className="sr-only">{t('table.pagination.last')}</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}

function DataTableRowActions<T>({ row, actions }: { row: T; actions: DataTableActionsConfig<T> }) {
  const visibleItems = actions.items.filter((item) => !item.hidden?.(row));
  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground data-[state=open]:bg-muted"
        >
          <EllipsisVertical />
          <span className="sr-only">{actions.menuLabel ?? 'Open menu'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {visibleItems.map((item) => {
          const showSeparator =
            typeof item.separatorBefore === 'function' ? item.separatorBefore(row) : Boolean(item.separatorBefore);
          const isLoading = resolveActionFlag(item.loading, row);
          const isDisabled = isLoading || resolveActionFlag(item.disabled, row);
          const Icon = resolveActionIcon(item, row);
          const disabledReason = isDisabled && !isLoading ? resolveActionReason(item.disabledReason, row) : null;
          const menuItem = (
            <DropdownMenuItem
              variant={item.variant}
              disabled={isDisabled}
              onSelect={(event) => {
                event.preventDefault();
                if (isDisabled) {
                  return;
                }
                item.onSelect(row);
              }}
            >
              {isLoading ? <Spinner /> : Icon ? <Icon /> : null}
              {typeof item.label === 'function' ? item.label(row) : item.label}
            </DropdownMenuItem>
          );

          return (
            <Fragment key={item.id}>
              {showSeparator ? <DropdownMenuSeparator /> : null}
              {disabledReason ? (
                <DisabledWithTooltip reason={disabledReason} side="left" className="flex w-full" isFocusable={false}>
                  {menuItem}
                </DisabledWithTooltip>
              ) : (
                menuItem
              )}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading = false,
  isRefreshing = false,
  error,
  empty,
  actions = false,
  pagination = false,
  skeletonRows = VIEWPORT_BODY_ROWS,
  reorder,
  fillHeight = false,
}: DataTableProps<T>) {
  const showActions = Boolean(actions);
  const columnCount = columns.length + (showActions ? 1 : 0) + (reorder ? 1 : 0);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const fillClass = fillHeight ? 'h-64' : BODY_FILL_HEIGHT_CLASS;
  const paginationConfig = pagination === false || pagination == null ? null : pagination;
  const pageSizes = paginationConfig?.pageSizes ?? DEFAULT_PAGE_SIZES;

  const { rows, total } = useMemo(() => {
    if (!paginationConfig) {
      return { rows: data, total: data.length };
    }
    if (paginationConfig.mode === 'client') {
      const start = (paginationConfig.page - 1) * paginationConfig.pageSize;
      return {
        rows: data.slice(start, start + paginationConfig.pageSize),
        total: data.length,
      };
    }
    return { rows: data, total: paginationConfig.total };
  }, [data, paginationConfig]);

  const hasState = !isLoading && (Boolean(error) || rows.length === 0);
  /** In a screen-filling table the empty or error state takes the whole body, not one table row. */
  const showFillState = fillHeight && hasState;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!reorder || !over || active.id === over.id) {
      return;
    }
    if (reorder.getGroupKey) {
      const activeRow = data.find((row) => getRowId(row) === active.id);
      const overRow = data.find((row) => getRowId(row) === over.id);
      if (!activeRow || !overRow || reorder.getGroupKey(activeRow) !== reorder.getGroupKey(overRow)) {
        return;
      }
    }
    reorder.onReorder(String(active.id), String(over.id));
  };

  return (
    <div className={cn('flex flex-col gap-4', fillHeight && 'min-h-0 flex-1')}>
      <div
        className={cn('overflow-hidden rounded-lg border', fillHeight && 'flex min-h-0 flex-1 flex-col')}
        aria-busy={isLoading || isRefreshing || undefined}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={rows.map(getRowId)} strategy={verticalListSortingStrategy}>
            <Table
              containerClassName={
                fillHeight
                  ? cn('min-h-0 overflow-auto', showFillState ? 'flex-none' : 'flex-1')
                  : `${BODY_VIEWPORT_CLASS} overflow-auto`
              }
            >
              <TableHeader className="sticky top-0 z-10 bg-muted">
                <TableRow className={HEADER_ROW_CLASS}>
                  {reorder ? <TableHead className="w-10" /> : null}
                  {columns.map((column) => (
                    <TableHead key={column.id} className={column.headerClassName}>
                      {column.header}
                    </TableHead>
                  ))}
                  {showActions ? <TableHead className="w-12" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody className={isRefreshing && !isLoading ? 'pointer-events-none opacity-50' : undefined}>
                {showFillState ? null : isLoading ? (
                  Array.from({ length: skeletonRows }, (_, rowIndex) => (
                    <TableRow key={`skeleton-${rowIndex}`} className={BODY_ROW_CLASS}>
                      {Array.from({ length: columnCount }, (__, cellIndex) => (
                        <TableCell key={cellIndex} className={BODY_CELL_CLASS}>
                          <Skeleton className="h-4 w-full max-w-40" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={columnCount} className={`${fillClass} text-center text-destructive`}>
                      {error}
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columnCount} className={`${fillClass} p-0`}>
                      <div className={`flex ${fillClass} items-center justify-center`}>
                        <DataTableEmptyState
                          title={empty?.title}
                          description={empty?.description}
                          icon={empty?.icon}
                          action={empty?.action}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const cells = (
                      <>
                        {columns.map((column) => (
                          <TableCell key={column.id} className={`${BODY_CELL_CLASS} ${column.className ?? ''}`}>
                            {column.cell(row)}
                          </TableCell>
                        ))}
                        {showActions && actions ? (
                          <TableCell className={`${BODY_CELL_CLASS} text-right`}>
                            <DataTableRowActions row={row} actions={actions} />
                          </TableCell>
                        ) : null}
                      </>
                    );
                    return reorder ? (
                      <DataTableSortableRow
                        key={getRowId(row)}
                        id={getRowId(row)}
                        enabled={reorder.enabled}
                        handleLabel={reorder.handleLabel}
                        disabledReason={reorder.disabledReason}
                        className={BODY_ROW_CLASS}
                      >
                        {cells}
                      </DataTableSortableRow>
                    ) : (
                      <TableRow key={getRowId(row)} className={BODY_ROW_CLASS}>
                        {cells}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
        {showFillState ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : (
              <DataTableEmptyState
                title={empty?.title}
                description={empty?.description}
                icon={empty?.icon}
                action={empty?.action}
              />
            )}
          </div>
        ) : null}
      </div>

      {paginationConfig ? (
        <DataTablePagination
          page={paginationConfig.page}
          pageSize={paginationConfig.pageSize}
          total={total}
          pageSizes={pageSizes}
          onPageChange={paginationConfig.onPageChange}
          onPageSizeChange={paginationConfig.onPageSizeChange}
        />
      ) : null}
    </div>
  );
}
