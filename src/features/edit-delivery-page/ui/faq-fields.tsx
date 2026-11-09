import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { FAQ_ITEMS_MAX, type DeliveryFormValues } from '../model/delivery-form-schema';
import { ListRowActions } from './list-row-actions';

/** FAQ list that looks like the accordion on the public page, with every question and answer editable in place. */
export function FaqFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<DeliveryFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'faq' });

  return (
    <div className="flex flex-col gap-4">
      {fields.length > 0 ? (
        <ul className="divide-y rounded-xl border bg-card px-6">
          {fields.map((field, index) => {
            const errors = formState.errors.faq?.[index];
            return (
              <li key={field.id} className="flex flex-col gap-2 py-4">
                <div className="flex items-start gap-2">
                  <Input
                    autoComplete="off"
                    className="h-auto px-2 py-1.5 text-base font-medium"
                    aria-label={t('admin.deliveryPage.faqQuestion', { number: index + 1 })}
                    placeholder={t('admin.deliveryPage.fields.question')}
                    aria-required
                    aria-invalid={!!errors?.question || undefined}
                    {...register(`faq.${index}.question`)}
                  />
                  <ListRowActions index={index} count={fields.length} canRemove onMove={move} onRemove={remove} />
                </div>
                <FieldError errors={[translateFieldError(errors?.question, t)]} />
                <Textarea
                  rows={3}
                  className="px-2 py-1.5 text-base text-muted-foreground"
                  aria-label={t('admin.deliveryPage.faqAnswer', { number: index + 1 })}
                  placeholder={t('admin.deliveryPage.fields.answer')}
                  aria-required
                  aria-invalid={!!errors?.answer || undefined}
                  {...register(`faq.${index}.answer`)}
                />
                <FieldError errors={[translateFieldError(errors?.answer, t)]} />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          {t('admin.deliveryPage.faqEmpty')}
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={fields.length >= FAQ_ITEMS_MAX}
        onClick={() => append({ question: '', answer: '' })}
      >
        <Plus aria-hidden />
        {t('admin.deliveryPage.addFaq')}
      </Button>
    </div>
  );
}
