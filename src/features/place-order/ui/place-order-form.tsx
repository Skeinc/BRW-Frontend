import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { clearCart, type CartLine } from '@/entities/cart';
import { createOrder } from '@/entities/order';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PhoneInput } from '@/shared/ui/phone-input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { SegmentedControl } from '@/shared/ui/segmented-control';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import {
  CHECKOUT_DEFAULT_VALUES,
  checkoutFormSchema,
  DELIVERY_METHODS,
  PAYMENT_METHODS,
  type CheckoutFormValues,
} from '../model/checkout-form-schema';
import { getRejectedFields } from '../model/map-server-errors';
import { toOrderInput } from '../model/to-order-input';

interface PlaceOrderFormProps {
  /** Lines to send; the page drops the products that are gone, otherwise the API rejects the whole request. */
  lines: readonly CartLine[];
  /** Called before the cart is cleared, so the page does not mistake the emptied cart for a reason to leave. */
  onPlaced: () => void;
}

export function PlaceOrderForm({ lines, onPlaced }: PlaceOrderFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: CHECKOUT_DEFAULT_VALUES,
  });
  const { register, control, handleSubmit, setError, setFocus, formState } = form;
  const { errors } = formState;
  const isDelivery = useWatch({ control, name: 'deliveryMethod' }) === 'delivery';

  const submit = useMutation({
    mutationFn: (values: CheckoutFormValues) => createOrder(toOrderInput(values, lines)),
    onSuccess: ({ number }) => {
      onPlaced();
      clearCart();
      void navigate({ to: '/order/$number', params: { number }, replace: true });
    },
    onError: (error) => {
      const rejected = getRejectedFields(error);
      for (const field of rejected) {
        setError(field, { message: field === 'phone' ? 'checkout.validation.phone' : 'checkout.validation.invalid' });
      }
      if (rejected[0]) {
        setFocus(rejected[0]);
      }
    },
  });

  const submitError = submit.error;
  const hasRejectedFields = getRejectedFields(submitError).length > 0;
  const isUnavailable = submitError instanceof ApiError && submitError.code === 'ORDER_ITEM_UNAVAILABLE';

  return (
    <form noValidate onSubmit={handleSubmit((values) => submit.mutate(values))} className="flex flex-col gap-8">
      <FieldSet>
        <FieldLegend>{t('checkout.sections.contacts')}</FieldLegend>
        <FieldGroup>
          <Field data-invalid={!!errors.contactName || undefined}>
            <FieldLabel htmlFor="checkout-name">
              {t('checkout.fields.name')}
              <RequiredMark />
            </FieldLabel>
            <Input
              id="checkout-name"
              autoComplete="name"
              aria-required
              aria-invalid={!!errors.contactName || undefined}
              className="h-11"
              {...register('contactName')}
            />
            <FieldError errors={[translateFieldError(errors.contactName, t)]} />
          </Field>
          <Field data-invalid={!!errors.phone || undefined}>
            <FieldLabel htmlFor="checkout-phone">
              {t('checkout.fields.phone')}
              <RequiredMark />
            </FieldLabel>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <PhoneInput
                  id="checkout-phone"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-required
                  aria-invalid={!!errors.phone || undefined}
                  className="h-11"
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FieldError errors={[translateFieldError(errors.phone, t)]} />
          </Field>
          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="checkout-email">{t('checkout.fields.email')}</FieldLabel>
            <Input
              id="checkout-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email || undefined}
              className="h-11"
              {...register('email')}
            />
            <FieldError errors={[translateFieldError(errors.email, t)]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>{t('checkout.sections.delivery')}</FieldLegend>
        <FieldGroup>
          <Controller
            control={control}
            name="deliveryMethod"
            render={({ field }) => (
              <SegmentedControl
                value={field.value}
                onChange={field.onChange}
                ariaLabel={t('checkout.sections.delivery')}
                listClassName="h-11 w-full"
                options={DELIVERY_METHODS.map((value) => ({ value, label: t(`checkout.delivery.${value}`) }))}
              />
            )}
          />
          {isDelivery ? (
            <>
              <Field data-invalid={!!errors.city || undefined}>
                <FieldLabel htmlFor="checkout-city">
                  {t('checkout.fields.city')}
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="checkout-city"
                  autoComplete="address-level2"
                  aria-required
                  aria-invalid={!!errors.city || undefined}
                  className="h-11"
                  {...register('city')}
                />
                <FieldError errors={[translateFieldError(errors.city, t)]} />
              </Field>
              <Field data-invalid={!!errors.address || undefined}>
                <FieldLabel htmlFor="checkout-address">
                  {t('checkout.fields.address')}
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="checkout-address"
                  autoComplete="street-address"
                  aria-required
                  aria-invalid={!!errors.address || undefined}
                  className="h-11"
                  {...register('address')}
                />
                <FieldError errors={[translateFieldError(errors.address, t)]} />
              </Field>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t('checkout.pickupNote')}</p>
          )}
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>{t('checkout.sections.payment')}</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="checkout-payment">{t('checkout.fields.payment')}</FieldLabel>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="checkout-payment" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`checkout.payment.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field data-invalid={!!errors.comment || undefined}>
            <FieldLabel htmlFor="checkout-comment">{t('checkout.fields.comment')}</FieldLabel>
            <Textarea
              id="checkout-comment"
              rows={3}
              aria-invalid={!!errors.comment || undefined}
              {...register('comment')}
            />
            <FieldError errors={[translateFieldError(errors.comment, t)]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Field data-invalid={!!errors.consent || undefined}>
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Checkbox
                id="checkout-consent"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.consent || undefined}
                className="size-5"
              />
              <label htmlFor="checkout-consent" className="text-sm leading-snug">
                {t('checkout.consent')}
              </label>
            </div>
          )}
        />
        <FieldError errors={[translateFieldError(errors.consent, t)]} />
      </Field>

      {submitError && !hasRejectedFields && (
        <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <p className="text-destructive">{getApiErrorMessage(submitError, t)}</p>
          {isUnavailable && (
            <Button asChild variant="outline" className="mt-3 h-11">
              <Link to="/cart">{t('checkout.backToCart')}</Link>
            </Button>
          )}
        </div>
      )}

      <Button type="submit" className="h-12 text-base" disabled={submit.isPending || lines.length === 0}>
        {submit.isPending ? t('checkout.submitting') : t('checkout.submit')}
      </Button>
    </form>
  );
}
