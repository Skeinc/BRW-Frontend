import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  categoriesPageQueryOptions,
  categoryTreeQueryOptions,
  useMoveCategory,
  type Category,
} from '@/entities/category';
import { EntityGallery } from '@/features/entity-gallery';
import { CategoryFormDialog } from '@/features/upsert-category';
import { getApiErrorMessage } from '@/shared/api';
import { useLinkedEntity } from '@/shared/lib/use-linked-entity';
import { hasCategoryFilters, toCategoryListParams, type CategoriesSearch } from '../model/categories-search';
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
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const rows = categoriesQuery.data?.items ?? [];
  const total = categoriesQuery.data?.total ?? 0;
  const isFiltered = hasCategoryFilters(search);
  const editedCategory = editor === 'new' ? null : editor;

  const treeQuery = useQuery({ ...categoryTreeQueryOptions, enabled: Boolean(search.edit) });
  useLinkedEntity({
    id: search.edit,
    items: treeQuery.data,
    isError: treeQuery.isError,
    onFound: setEditor,
    onMissing: () => toast.error(t('admin.common.linkedNotFound')),
    onHandled: () => onSearchChange({ edit: undefined }),
  });

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

  const resetFilters = () => changeFilter({ q: undefined, published: undefined, level: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <CategoriesToolbar
        search={search}
        hasFilters={isFiltered}
        onChange={changeFilter}
        onReset={resetFilters}
        onCreate={() => setEditor('new')}
      />
      <CategoriesTable
        rows={rows}
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
