import { useTranslation } from 'react-i18next';
import type { StockStatus } from '@/entities/product';
import { Badge } from '@/shared/ui/badge';

const VARIANTS: Record<StockStatus, 'default' | 'secondary' | 'destructive'> = {
  in_stock: 'default',
  on_order: 'secondary',
  out_of_stock: 'destructive',
};

interface StockBadgeProps {
  status: StockStatus;
}

export function StockBadge({ status }: StockBadgeProps) {
  const { t } = useTranslation();
  return <Badge variant={VARIANTS[status]}>{t(`admin.products.stock.${status}`)}</Badge>;
}
