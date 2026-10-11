import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { PagePlaceholder } from '@/shared/ui/page-placeholder';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <PagePlaceholder heading={t('pages.notFound.heading')} lead={t('pages.notFound.lead')}>
      <Button asChild className="mt-6 h-11">
        <Link to="/catalog">{t('pages.notFound.action')}</Link>
      </Button>
    </PagePlaceholder>
  );
}
