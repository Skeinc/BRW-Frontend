import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/shared/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/shared/ui/pagination';
import { cn } from '@/shared/lib/utils';

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
}

function getPageItems(page: number, totalPages: number): (number | 'gap-start' | 'gap-end')[] {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted].filter((value) => value >= 1 && value <= totalPages).toSorted((a, b) => a - b);
  const items: (number | 'gap-start' | 'gap-end')[] = [];
  pages.forEach((value, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && value - previous > 1) {
      items.push(previous < page ? 'gap-start' : 'gap-end');
    }
    items.push(value);
  });
  return items;
}

function linkClass(isActive: boolean): string {
  return cn(
    buttonVariants({ variant: isActive ? 'default' : 'outline', size: 'icon' }),
    'size-11 bg-card',
    isActive && 'bg-primary',
  );
}

export function CatalogPagination({ page, totalPages }: CatalogPaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) {
    return null;
  }
  return (
    <Pagination aria-label={t('catalog.pagination.label')}>
      <PaginationContent>
        <PaginationItem>
          <Link
            to="."
            search={(prev) => ({ ...prev, page: page - 1 > 1 ? page - 1 : undefined })}
            disabled={page <= 1}
            aria-label={t('catalog.pagination.previous')}
            className={cn(linkClass(false), page <= 1 && 'pointer-events-none opacity-50')}
          >
            <ChevronLeft aria-hidden />
          </Link>
        </PaginationItem>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <PaginationItem key={item}>
              <Link
                to="."
                search={(prev) => ({ ...prev, page: item > 1 ? item : undefined })}
                aria-current={item === page ? 'page' : undefined}
                className={linkClass(item === page)}
              >
                {item}
              </Link>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <Link
            to="."
            search={(prev) => ({ ...prev, page: page + 1 })}
            disabled={page >= totalPages}
            aria-label={t('catalog.pagination.next')}
            className={cn(linkClass(false), page >= totalPages && 'pointer-events-none opacity-50')}
          >
            <ChevronRight aria-hidden />
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
