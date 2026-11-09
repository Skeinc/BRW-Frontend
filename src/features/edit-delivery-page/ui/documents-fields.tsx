import { FileSignature, FileText, Plus, Receipt, Truck } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';
import { DOCUMENTS_MAX, type DeliveryFormValues } from '../model/delivery-form-schema';
import { ListRowActions } from '@/shared/ui/list-row-actions';

const DOCUMENT_ICONS = [Receipt, Truck, FileSignature, FileText] as const;

/** Document cards that look like the ones on the public page, with the text editable in place. */
export function DocumentsFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<DeliveryFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'documents' });

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid gap-4">
        {fields.map((field, index) => {
          const Icon = DOCUMENT_ICONS[index] ?? FileText;
          const error = formState.errors.documents?.[index]?.text;
          return (
            <li key={field.id} className="flex flex-col gap-2 rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon aria-hidden className="size-5" />
                </span>
                <ListRowActions
                  index={index}
                  count={fields.length}
                  canRemove={fields.length > 1}
                  onMove={move}
                  onRemove={remove}
                />
              </div>
              <Textarea
                rows={3}
                className="px-2 py-1.5 font-semibold"
                aria-label={t('admin.deliveryPage.fields.document', { number: index + 1 })}
                placeholder={t('admin.deliveryPage.fields.text')}
                aria-required
                aria-invalid={!!error || undefined}
                {...register(`documents.${index}.text`)}
              />
              <FieldError errors={[translateFieldError(error, t)]} />
            </li>
          );
        })}
      </ul>
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={fields.length >= DOCUMENTS_MAX}
        onClick={() => append({ text: '' })}
      >
        <Plus aria-hidden />
        {t('admin.deliveryPage.addDocument')}
      </Button>
    </div>
  );
}
