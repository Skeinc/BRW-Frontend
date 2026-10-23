import type { ReactNode } from 'react';
import { LanguageSwitcher } from '@/features/switch-language';
import './admin-auth-shell.css';

interface AdminAuthShellProps {
  children: ReactNode;
}

export function AdminAuthShell({ children }: AdminAuthShellProps) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <div className="admin-auth-backdrop" aria-hidden="true">
        <div className="admin-auth-grid" />
        <div className="admin-auth-glow admin-auth-glow-a" />
        <div className="admin-auth-glow admin-auth-glow-b" />
        <div className="admin-auth-glow admin-auth-glow-c" />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
