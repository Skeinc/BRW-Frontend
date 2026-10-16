import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { categoriesPageQueryOptions, useMoveCategory, type Category } from '@/entities/category';
import { EntityGallery } from '@/features/entity-gallery';
import { CategoryFormDialog } from '@/features/upsert-category';
import { getApiErrorMessage } from '@/shared/api';
import {
  getVisibleRows,
  hasCategoryFilters,
  toCategoryListParams,
  type CategoriesSearch,
} from '../model/categories-search';
import { CategoriesTable } from './categories-table';
import { CategoriesToolbar } from './categories-toolbar';
import { DeleteCategoryDialog } from './delete-category-dialog';

/** `'new'` opens the create form; a category opens its edit form. */
type EditorTarget = Category | 'new' | null;

interface AdminCategoriesPageProps {
  search: CategoriesSearch;
  onSearchChange: (patch: Partial<CategoriesSearch>) => void;
}

export function AdminCategoriesPage({ search, onSearchChange }: AdminCategoriesPageProps) {
  const { t } = useTranslation();
  const params = toCategoryListParams(search);
  const pageQuery = categoriesPageQueryOptions(params);
  const categoriesQuery = useQuery({ ...pageQuery, placeholderData: keepPreviousData });
  const move = useMoveCategory(pageQuery.queryKey);
  const [editor, setEditor] = useState<EditorTarget>(null);
  /** Branches the user collapsed; everything is expanded by default. Not kept in the URL. */
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(new Set());
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const rows = categoriesQuery.data?.items ?? [];
  const total = categoriesQuery.data?.total ?? 0;
  const isFiltered = hasCategoryFilters(search);
  const editedCategory = editor === 'new' ? null : editor;

  /** After the last row of a page is deleted or filtered out, step back to the last page that still has rows. */
  useEffect(() => {
    if (categoriesQuery.isSuccess && !categoriesQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [
    categoriesQuery.isSuccess,
    categoriesQuery.isPlaceholderData,
    rows.length,
    total,
    params.pageSize,
    onSearchChange,
  ]);

  /** Any filter change goes back to the first page. */
  const changeFilter = (patch: Partial<CategoriesSearch>) => onSearchChange({ ...patch, page: undefined });

  const toggleCategory = (category: Category) => {
    const next = new Set(collapsedIds);
    if (!next.delete(category.id)) {
      next.add(category.id);
    }
    setCollapsedIds(next);
  };
  const expandableIds = rows.filter((row) => row.childCount > 0).map((row) => row.id);
  const isCollapsed = collapsedIds.size > 0;
  const toggleAll = () => setCollapsedIds(isCollapsed ? new Set() : new Set(expandableIds));

  const resetFilters = () => changeFilter({ q: undefined, published: undefined, level: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <CategoriesToolbar
        search={search}
        hasFilters={isFiltered}
        onChange={changeFilter}
        onReset={resetFilters}
        canCollapse={expandableIds.length > 0}
        isCollapsed={isCollapsed}
        onToggleAll={toggleAll}
        onCreate={() => setEditor('new')}
      />
      <CategoriesTable
        rows={isFiltered ? rows : getVisibleRows(rows, collapsedIds)}
        total={total}
        isFiltered={isFiltered}
        isPending={categoriesQuery.isPending}
        isRefreshing={categoriesQuery.isFetching && !categoriesQuery.isPending}
        error={categoriesQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onReorder={(id, overId) =>
          move.mutate({ id, overId }, { onError: (error) => toast.error(getApiErrorMessage(error, t)) })
        }
        collapsedIds={collapsedIds}
        onToggle={toggleCategory}
        onCreate={() => setEditor('new')}
        onResetFilters={resetFilters}
        onEdit={setEditor}
        onDelete={setCategoryToDelete}
      />
      {editor !== null ? (
        <CategoryFormDialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditor(null);
            }
          }}
          category={editedCategory}
          onSaved={(saved, wasCreated) => setEditor(wasCreated ? saved : null)}
          gallery={
            editedCategory ? (
              <EntityGallery owner="categories" ownerId={editedCategory.id} single hideTitle />
            ) : undefined
          }
        />
      ) : null}
      <DeleteCategoryDialog category={categoryToDelete} onClose={() => setCategoryToDelete(null)} />
    </div>
  );
}
