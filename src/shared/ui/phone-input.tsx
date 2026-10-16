import { useLayoutEffect, useRef, type ComponentProps } from 'react';
import { applyPhoneEdit, formatPhoneAsTyped, getCaretPosition, getPhoneDigits } from '@/shared/lib/phone';
import { Input } from './input';

interface PhoneInputProps extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> {
  /** The number as `+` and digits, for example `+375334885000`, or an empty string. */
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * Phone field with a mask that follows the country of the code typed: `+375 33 488 50 00`, `+7 912 345-67-89`,
 * and so on. The value it reports is clean (`+` and digits), ready to send to the API. The caret stays where the
 * user edits, also in the middle of a number.
 */
export function PhoneInput({
  value,
  onValueChange,
  ref,
  placeholder = '+375 29 123 45 67',
  ...props
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const caretDigitsRef = useRef<number | null>(null);
  const currentDigits = getPhoneDigits(value);
  const formatted = formatPhoneAsTyped(currentDigits);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (caretDigitsRef.current !== null && input && document.activeElement === input) {
      const position = getCaretPosition(formatted, caretDigitsRef.current);
      input.setSelectionRange(position, position);
    }
    caretDigitsRef.current = null;
  });

  return (
    <Input
      ref={(element) => {
        inputRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder={placeholder}
      value={formatted}
      onChange={(event) => {
        const edit = applyPhoneEdit({
          raw: event.target.value,
          caret: event.target.selectionStart ?? event.target.value.length,
          previousDigits: currentDigits,
          inputType: (event.nativeEvent as InputEvent).inputType,
        });
        caretDigitsRef.current = edit.digitsBeforeCaret;
        onValueChange(edit.digits ? `+${edit.digits}` : '');
      }}
      {...props}
    />
  );
}
