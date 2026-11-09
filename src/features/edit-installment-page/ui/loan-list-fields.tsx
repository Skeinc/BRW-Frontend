import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { ListRowActions } from '@/shared/ui/list-row-actions';
import { LOANS_MAX, type InstallmentFormValues } from '../model/installment-form-schema';
import { LoanFields } from './loan-fields';

/** Bank loan cards, one per row, with adding, removing and reordering. */
export function LoanListFields() {
  const { t } = useTranslation();
  const { control } = useFormContext<InstallmentFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'loans' });
  return (
    <div className="flex flex-col gap-4">
      <ul className="grid gap-4">
        {fields.map((field, index) => (
          <li key={field.id} className="flex flex-col rounded-xl border bg-card p-6">
            <div className="mb-2 flex justify-end">
              <ListRowActions
                index={index}
                count={fields.length}
                canRemove={fields.length > 1}
                onMove={move}
                onRemove={remove}
              />
            </div>
            <LoanFields index={index} />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={fields.length >= LOANS_MAX}
        onClick={() =>
          append({ bank: '', name: '', badges: [], term: '', rate: '', facts: [], details: [], steps: [] })
        }
      >
        <Plus aria-hidden />
        {t('admin.installmentPage.add.loan')}
      </Button>
    </div>
  );
}
