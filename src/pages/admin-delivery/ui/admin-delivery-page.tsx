import { useQuery } from '@tanstack/react-query';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminDeliveryPageQueryOptions, buildDefaultDeliveryContent } from '@/entities/delivery-page';
import { DeliveryPageForm } from '@/features/edit-delivery-page';
import { getApiErrorMessage } from '@/shared/api';
import { DEFAULT_LANGUAGE } from '@/shared/i18n';
import { DataTableEmptyState } from '@/shared/ui/data-table-empty-state';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export function AdminDeliveryPage() {
  const { t } = useTranslation();
  const query = useQuery(adminDeliveryPageQueryOptions);

  if (query.isPending) {
    return <ScreenSkeleton />;
  }
  if (query.isError) {
    return <DataTableEmptyState icon={TriangleAlert} title={getApiErrorMessage(query.error, t)} />;
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DeliveryPageForm content={query.data.content ?? buildDefaultDeliveryContent(DEFAULT_LANGUAGE)} />
    </div>
  );
}
