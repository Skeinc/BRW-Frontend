import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { adminMeQueryKey, loginAdmin } from '@/entities/admin-session';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { signInSchema, type SignInValues } from '../model/sign-in-schema';

interface SignInFormProps {
  onSuccess: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const errors = form.formState.errors;

  const signIn = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (me) => {
      queryClient.setQueryData(adminMeQueryKey, me);
      onSuccess();
    },
  });

  const serverError = signIn.isError
    ? signIn.error instanceof ApiError && signIn.error.code === 'UNAUTHORIZED'
      ? t('admin.auth.invalidCredentials')
      : getApiErrorMessage(signIn.error, t)
    : null;

  return (
    <Card>
      <CardHeader className="justify-items-center text-center">
        <BrandLogo tone="onLight" className="mb-3 [&_span.hidden]:block" />
        <CardTitle>{t('admin.auth.title')}</CardTitle>
        <CardDescription>{t('admin.auth.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => signIn.mutate(values))}
          noValidate
          className="flex flex-col gap-5"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.email || undefined}>
              <FieldLabel htmlFor="admin-email">{t('admin.auth.email')}</FieldLabel>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                aria-invalid={!!errors.email || undefined}
                {...form.register('email')}
              />
              <FieldError errors={[translateFieldError(errors.email, t)]} />
            </Field>
            <Field data-invalid={!!errors.password || undefined}>
              <FieldLabel htmlFor="admin-password">{t('admin.auth.password')}</FieldLabel>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password || undefined}
                {...form.register('password')}
              />
              <FieldError errors={[translateFieldError(errors.password, t)]} />
            </Field>
          </FieldGroup>
          {serverError ? (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          ) : null}
          <Button type="submit" size="lg" loading={signIn.isPending}>
            {t('admin.auth.submit')}
          </Button>
          <Button asChild type="button" variant="ghost" size="lg">
            <Link to="/">{t('nav.goHome')}</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
