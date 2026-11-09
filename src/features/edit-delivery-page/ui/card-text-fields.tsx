import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { FieldError } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import type { DeliveryFormValues } from '../model/delivery-form-schema';

interface CardTextFieldsProps {
  name: 'payment' | 'delivery' | 'receiving';
  index: number;
  /** Accessible name of the card, e.g. "Cash on delivery". */
  label: string;
}

/** Title shown like the card heading and the text shown like the card paragraph. */
export function CardTextFields({ name, index, label }: CardTextFieldsProps) {
  const { t } = useTranslation();
  const { register, formState } = useFormContext<DeliveryFormValues>();
  const errors = formState.errors[name]?.[index];

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Input
        autoComplete="off"
        className="h-auto px-2 py-1.5 text-lg font-semibold"
        aria-label={`${label}: ${t('admin.deliveryPage.fields.title')}`}
        placeholder={t('admin.deliveryPage.fields.title')}
        aria-required
        aria-invalid={!!errors?.title || undefined}
        {...register(`${name}.${index}.title`)}
      />
      <FieldError errors={[translateFieldError(errors?.title, t)]} />
      <Textarea
        rows={4}
        className="px-2 py-1.5 text-muted-foreground"
        aria-label={`${label}: ${t('admin.deliveryPage.fields.text')}`}
        placeholder={t('admin.deliveryPage.fields.text')}
        aria-required
        aria-invalid={!!errors?.text || undefined}
        {...register(`${name}.${index}.text`)}
      />
      <FieldError errors={[translateFieldError(errors?.text, t)]} />
    </div>
  );
}
