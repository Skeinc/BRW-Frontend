import { useQuery } from '@tanstack/react-query';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminInstallmentPageQueryOptions, buildDefaultInstallmentContent } from '@/entities/installment-page';
import { InstallmentPageForm } from '@/features/edit-installment-page';
import { getApiErrorMessage } from '@/shared/api';
import { DEFAULT_LANGUAGE } from '@/shared/i18n';
import { DataTableEmptyState } from '@/shared/ui/data-table-empty-state';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export function AdminInstallmentPage() {
  const { t } = useTranslation();
  const query = useQuery(adminInstallmentPageQueryOptions);

  if (query.isPending) {
    return <ScreenSkeleton />;
  }
  if (query.isError) {
    return <DataTableEmptyState icon={TriangleAlert} title={getApiErrorMessage(query.error, t)} />;
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <InstallmentPageForm content={query.data.content ?? buildDefaultInstallmentContent(DEFAULT_LANGUAGE)} />
    </div>
  );
}
