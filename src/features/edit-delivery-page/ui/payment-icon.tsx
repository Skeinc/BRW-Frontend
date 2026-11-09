import type { LucideIcon } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';
import type { DeliveryFormValues } from '../model/delivery-form-schema';

interface PaymentIconProps {
  icon: LucideIcon;
  index: number;
}

/** Red while the payment method is active, grey while it is switched off. */
export function PaymentIcon({ icon: Icon, index }: PaymentIconProps) {
  const { control } = useFormContext<DeliveryFormValues>();
  const enabled = useWatch({ control, name: `payment.${index}.enabled` });
  return <Icon aria-hidden className={cn('size-8', enabled ? 'text-primary' : 'text-muted-foreground')} />;
}
