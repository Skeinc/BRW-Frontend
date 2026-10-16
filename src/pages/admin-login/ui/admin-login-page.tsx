import { useNavigate } from '@tanstack/react-router';
import { SignInForm } from '@/features/admin-sign-in';
import { AdminAuthShell } from '@/widgets/admin-auth-shell';

export function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <AdminAuthShell>
      <SignInForm onSuccess={() => void navigate({ to: '/admin' })} />
    </AdminAuthShell>
  );
}
