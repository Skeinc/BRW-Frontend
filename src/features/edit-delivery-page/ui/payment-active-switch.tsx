import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/shared/ui/switch';
import type { DeliveryFormValues } from '../model/delivery-form-schema';

interface PaymentActiveSwitchProps {
  index: number;
}

/** Active (red icon) or temporarily unavailable (grey, dashed) state of one payment method. */
export function PaymentActiveSwitch({ index }: PaymentActiveSwitchProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<DeliveryFormValues>();
  return (
    <Controller
      control={control}
      name={`payment.${index}.enabled`}
      render={({ field }) => (
        <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
          {t('admin.deliveryPage.paymentActive')}
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </label>
      )}
    />
  );
}
