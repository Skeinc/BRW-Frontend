import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { ListRowActions } from '@/shared/ui/list-row-actions';
import { STEPS_MAX, type InstallmentFormValues } from '../model/installment-form-schema';
import { InlineField } from './inline-field';

interface LoanStepsFieldsProps {
  loanIndex: number;
}

/** The numbered "Order of application" list of a loan. */
export function LoanStepsFields({ loanIndex }: LoanStepsFieldsProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<InstallmentFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: `loans.${loanIndex}.steps` });
  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <span className="mt-2 w-5 shrink-0 text-sm text-muted-foreground">{index + 1}.</span>
          <InlineField
            name={`loans.${loanIndex}.steps.${index}.text`}
            label={t('admin.installmentPage.fields.step', { number: index + 1 })}
            className="text-sm"
            multiline
          />
          <ListRowActions index={index} count={fields.length} canRemove onMove={move} onRemove={remove} />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={fields.length >= STEPS_MAX}
        onClick={() => append({ text: '' })}
      >
        <Plus aria-hidden />
        {t('admin.installmentPage.add.step')}
      </Button>
    </div>
  );
}
