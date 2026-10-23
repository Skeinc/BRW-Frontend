import { PackageSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

interface CatalogEmptyProps {
  onReset: () => void;
}

export function CatalogEmpty({ onReset }: CatalogEmptyProps) {
  const { t } = useTranslation();
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageSearch aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{t('catalog.empty.title')}</EmptyTitle>
        <EmptyDescription>{t('catalog.empty.description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button className="h-11" onClick={onReset}>
          {t('catalog.filters.reset')}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
