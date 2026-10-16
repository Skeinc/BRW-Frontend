import { AsYouType, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min';

/** Numbers without a country code ("8029...", "029...") are read as Belarusian. */
const DEFAULT_COUNTRY: CountryCode = 'BY';
const MAX_PHONE_DIGITS = 15;

/** A phone number in the international format of its country, e.g. `+375 33 488 50 00`; unknown text is returned as it is. */
export function formatPhone(value: string): string {
  const parsed = parsePhoneNumberFromString(value, DEFAULT_COUNTRY);
  return parsed ? parsed.formatInternational() : value;
}

/** `tel:` link target with only the digits and the leading plus. */
export function toTelHref(value: string): string {
  const parsed = parsePhoneNumberFromString(value, DEFAULT_COUNTRY);
  return `tel:${parsed ? parsed.number : value.replaceAll(/[^\d+]/g, '')}`;
}

/** Formats the digits typed so far for the field, following the number plan of the country the code points to. */
export function formatPhoneAsTyped(digits: string): string {
  return digits === '' ? '' : new AsYouType().input(`+${digits.slice(0, MAX_PHONE_DIGITS)}`);
}

/** Digits only, capped at the length of a phone number. */
export function getPhoneDigits(value: string): string {
  return value.replaceAll(/\D/g, '').slice(0, MAX_PHONE_DIGITS);
}

/** The result of an edit of the phone field: the digits to keep and how many digits stand before the caret. */
export interface PhoneEdit {
  digits: string;
  digitsBeforeCaret: number;
}

interface PhoneEditInput {
  /** What the field holds after the browser applied the edit. */
  raw: string;
  caret: number;
  /** The digits before the edit. */
  previousDigits: string;
  inputType: string;
}

/**
 * Turns one edit of the masked field into clean digits. Deleting a space or a bracket removes the neighbouring
 * digit instead of doing nothing, and the Belarusian national form `8 029 ...` becomes `+375 29 ...`.
 */
export function applyPhoneEdit({ raw, caret, previousDigits, inputType }: PhoneEditInput): PhoneEdit {
  let digits = getPhoneDigits(raw);
  let digitsBeforeCaret = getPhoneDigits(raw.slice(0, caret)).length;
  if (digits === previousDigits) {
    if (inputType === 'deleteContentBackward' && digitsBeforeCaret > 0) {
      digits = digits.slice(0, digitsBeforeCaret - 1) + digits.slice(digitsBeforeCaret);
      digitsBeforeCaret -= 1;
    } else if (inputType === 'deleteContentForward' && digitsBeforeCaret < digits.length) {
      digits = digits.slice(0, digitsBeforeCaret) + digits.slice(digitsBeforeCaret + 1);
    }
  }
  if (digits.startsWith('80') && digits.length > 2) {
    digits = `375${digits.slice(2)}`;
    digitsBeforeCaret = digitsBeforeCaret >= 2 ? digitsBeforeCaret + 1 : digitsBeforeCaret;
  }
  return { digits, digitsBeforeCaret };
}

/** Caret position in the formatted text that stands right after the given number of digits. */
export function getCaretPosition(formatted: string, digitsBeforeCaret: number): number {
  if (digitsBeforeCaret <= 0) {
    return formatted === '' ? 0 : 1;
  }
  let seen = 0;
  for (const [index, char] of [...formatted].entries()) {
    if (/\d/.test(char)) {
      seen += 1;
      if (seen === digitsBeforeCaret) {
        return index + 1;
      }
    }
  }
  return formatted.length;
}
