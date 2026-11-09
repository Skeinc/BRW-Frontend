import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { ListRowActions } from '@/shared/ui/list-row-actions';
import { BADGES_MAX, type InstallmentFormValues } from '../model/installment-form-schema';
import { InlineField } from './inline-field';

interface LoanBadgesFieldsProps {
  loanIndex: number;
}

/** The grey pills under the loan name. */
export function LoanBadgesFields({ loanIndex }: LoanBadgesFieldsProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<InstallmentFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: `loans.${loanIndex}.badges` });
  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-1">
          <InlineField
            name={`loans.${loanIndex}.badges.${index}.text`}
            label={t('admin.installmentPage.fields.badge')}
          />
          <ListRowActions index={index} count={fields.length} canRemove onMove={move} onRemove={remove} />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={fields.length >= BADGES_MAX}
        onClick={() => append({ text: '' })}
      >
        <Plus aria-hidden />
        {t('admin.installmentPage.add.badge')}
      </Button>
    </div>
  );
}
