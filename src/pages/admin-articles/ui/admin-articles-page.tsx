import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { articlesPageQueryOptions, type ArticleListItem } from '@/entities/article';
import { EntityGallery } from '@/features/entity-gallery';
import { ArticleFormDialog } from '@/features/upsert-article';
import { hasArticleFilters, toArticleListParams, type ArticlesSearch } from '../model/articles-search';
import { ArticlesTable } from './articles-table';
import { ArticlesToolbar } from './articles-toolbar';
import { DeleteArticleDialog } from './delete-article-dialog';

interface AdminArticlesPageProps {
  search: ArticlesSearch;
  onSearchChange: (patch: Partial<ArticlesSearch>) => void;
}

export function AdminArticlesPage({ search, onSearchChange }: AdminArticlesPageProps) {
  const params = toArticleListParams(search);
  const articlesQuery = useQuery({ ...articlesPageQueryOptions(params), placeholderData: keepPreviousData });
  const [articleToDelete, setArticleToDelete] = useState<ArticleListItem | null>(null);

  const rows = articlesQuery.data?.items ?? [];
  const total = articlesQuery.data?.total ?? 0;
  const isFiltered = hasArticleFilters(search);

  /** After the last row of a page is deleted, step back to the last page that still has rows. */
  useEffect(() => {
    if (articlesQuery.isSuccess && !articlesQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [articlesQuery.isSuccess, articlesQuery.isPlaceholderData, rows.length, total, params.pageSize, onSearchChange]);

  /** Any filter change goes back to the first page. */
  const changeFilter = (patch: Partial<ArticlesSearch>) => onSearchChange({ ...patch, page: undefined });
  const resetFilters = () => changeFilter({ q: undefined, published: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <ArticlesToolbar
        search={search}
        hasFilters={isFiltered}
        onChange={changeFilter}
        onReset={resetFilters}
        onCreate={() => onSearchChange({ edit: 'new' })}
      />
      <ArticlesTable
        rows={rows}
        total={total}
        isFiltered={isFiltered}
        isPending={articlesQuery.isPending}
        isRefreshing={articlesQuery.isFetching && !articlesQuery.isPending}
        error={articlesQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onResetFilters={resetFilters}
        onCreate={() => onSearchChange({ edit: 'new' })}
        onEdit={(article) => onSearchChange({ edit: article.id })}
        onDelete={setArticleToDelete}
      />
      <ArticleFormDialog
        target={search.edit ?? null}
        onClose={() => onSearchChange({ edit: undefined })}
        onCreated={(articleId) => onSearchChange({ edit: articleId })}
        renderGallery={(articleId) => <EntityGallery owner="articles" ownerId={articleId} hideTitle />}
      />
      <DeleteArticleDialog article={articleToDelete} onClose={() => setArticleToDelete(null)} />
    </div>
  );
}
