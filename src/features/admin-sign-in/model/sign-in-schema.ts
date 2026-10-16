import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email({ error: 'admin.auth.validation.email' }),
  password: z.string().min(1, { error: 'admin.auth.validation.password' }),
});

export type SignInValues = z.infer<typeof signInSchema>;
