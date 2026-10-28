import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { newsPageQueryOptions, type NewsListItem } from '@/entities/news';
import { EntityGallery } from '@/features/entity-gallery';
import { NewsFormDialog } from '@/features/upsert-news';
import { hasNewsFilters, toNewsListParams, type NewsSearch } from '../model/news-search';
import { NewsTable } from './news-table';
import { NewsToolbar } from './news-toolbar';
import { DeleteNewsItemDialog } from './delete-news-item-dialog';

interface AdminNewsPageProps {
  search: NewsSearch;
  onSearchChange: (patch: Partial<NewsSearch>) => void;
}

export function AdminNewsPage({ search, onSearchChange }: AdminNewsPageProps) {
  const params = toNewsListParams(search);
  const newsQuery = useQuery({ ...newsPageQueryOptions(params), placeholderData: keepPreviousData });
  const [newsItemToDelete, setNewsItemToDelete] = useState<NewsListItem | null>(null);

  const rows = newsQuery.data?.items ?? [];
  const total = newsQuery.data?.total ?? 0;
  const isFiltered = hasNewsFilters(search);

  /** After the last row of a page is deleted, step back to the last page that still has rows. */
  useEffect(() => {
    if (newsQuery.isSuccess && !newsQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [newsQuery.isSuccess, newsQuery.isPlaceholderData, rows.length, total, params.pageSize, onSearchChange]);

  /** Any filter change goes back to the first page. */
  const changeFilter = (patch: Partial<NewsSearch>) => onSearchChange({ ...patch, page: undefined });
  const resetFilters = () => changeFilter({ q: undefined, published: undefined, promo: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <NewsToolbar
        search={search}
        hasFilters={isFiltered}
        onChange={changeFilter}
        onReset={resetFilters}
        onCreate={() => onSearchChange({ edit: 'new' })}
      />
      <NewsTable
        rows={rows}
        total={total}
        isFiltered={isFiltered}
        isPending={newsQuery.isPending}
        isRefreshing={newsQuery.isFetching && !newsQuery.isPending}
        error={newsQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onResetFilters={resetFilters}
        onCreate={() => onSearchChange({ edit: 'new' })}
        onEdit={(newsItem) => onSearchChange({ edit: newsItem.id })}
        onDelete={setNewsItemToDelete}
      />
      <NewsFormDialog
        target={search.edit ?? null}
        onClose={() => onSearchChange({ edit: undefined })}
        onCreated={(newsId) => onSearchChange({ edit: newsId })}
        renderGallery={(newsId) => <EntityGallery owner="news" ownerId={newsId} hideTitle />}
      />
      <DeleteNewsItemDialog newsItem={newsItemToDelete} onClose={() => setNewsItemToDelete(null)} />
    </div>
  );
}
