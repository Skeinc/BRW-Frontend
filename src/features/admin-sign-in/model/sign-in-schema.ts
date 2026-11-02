import { z } from 'zod';

export const signInSchema = z.object({
  login: z.string().trim().min(1, { error: 'admin.auth.validation.login' }),
  password: z.string().min(1, { error: 'admin.auth.validation.password' }),
});

export type SignInValues = z.infer<typeof signInSchema>;
