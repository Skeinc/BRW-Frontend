import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { ListRowActions } from '@/shared/ui/list-row-actions';
import type { InstallmentFormValues } from '../model/installment-form-schema';
import { InlineField } from './inline-field';

interface LabeledValuesFieldsProps {
  loanIndex: number;
  name: 'facts' | 'details';
  max: number;
  addLabel: string;
  labelPlaceholder: string;
  valuePlaceholder: string;
}

/** Rows of a grey label and a value inside a loan card: the facts and the requirements. */
export function LabeledValuesFields({
  loanIndex,
  name,
  max,
  addLabel,
  labelPlaceholder,
  valuePlaceholder,
}: LabeledValuesFieldsProps) {
  const { control } = useFormContext<InstallmentFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: `loans.${loanIndex}.${name}` });
  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <InlineField
              name={`loans.${loanIndex}.${name}.${index}.label`}
              label={labelPlaceholder}
              className="text-sm text-muted-foreground"
            />
            <InlineField
              name={`loans.${loanIndex}.${name}.${index}.value`}
              label={valuePlaceholder}
              className="text-sm"
              multiline
            />
          </div>
          <ListRowActions index={index} count={fields.length} canRemove onMove={move} onRemove={remove} />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={fields.length >= max}
        onClick={() => append({ label: '', value: '' })}
      >
        <Plus aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}
