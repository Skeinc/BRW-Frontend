import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { RECEIVING_STEPS_MAX, type DeliveryFormValues } from '../model/delivery-form-schema';
import { CardTextFields } from './card-text-fields';
import { ListRowActions } from './list-row-actions';

type CardListName = 'payment' | 'delivery' | 'receiving';

interface CardListFieldsProps {
  name: CardListName;
  /** Fixed lists have a set number of cards: no adding, removing or reordering. */
  isFixed: boolean;
  /** Grid of the same shape as the block on the public page. */
  gridClassName: string;
  /** Accessible name of the card at that position. */
  getCardLabel: (index: number) => string;
  /** Icon or number shown at the top of the card, as on the public page. */
  renderLead: (index: number) => ReactNode;
  getCardClassName?: (index: number) => string | undefined;
  /** Read-only part of the card that the public page shows below the texts. */
  renderExtra?: (index: number) => ReactNode;
  /** Extra control in the top corner of the card, next to the row actions. */
  renderCorner?: (index: number) => ReactNode;
}

/** Cards that look like the ones on the public page, with the texts editable in place. */
export function CardListFields({
  name,
  isFixed,
  gridClassName,
  getCardLabel,
  renderLead,
  getCardClassName,
  renderExtra,
  renderCorner,
}: CardListFieldsProps) {
  const { t } = useTranslation();
  const { control, formState } = useFormContext<DeliveryFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-4">
      <ul className={gridClassName}>
        {fields.map((field, index) => (
          <li key={field.id} className={cn('flex flex-col rounded-xl border bg-card p-6', getCardClassName?.(index))}>
            <div className="flex items-start justify-between gap-2">
              {renderLead(index)}
              {renderCorner?.(index)}
              {isFixed ? null : (
                <ListRowActions
                  index={index}
                  count={fields.length}
                  canRemove={fields.length > 1}
                  onMove={move}
                  onRemove={remove}
                />
              )}
            </div>
            <CardTextFields name={name} index={index} label={getCardLabel(index)} />
            {renderExtra?.(index)}
          </li>
        ))}
      </ul>
      <FieldError errors={[translateFieldError(formState.errors[name]?.root, t)]} />
      {isFixed ? null : (
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          disabled={fields.length >= RECEIVING_STEPS_MAX}
          onClick={() => append({ title: '', text: '' })}
        >
          <Plus aria-hidden />
          {t('admin.deliveryPage.addStep')}
        </Button>
      )}
    </div>
  );
}
