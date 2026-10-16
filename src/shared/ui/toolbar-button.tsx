import type { LucideIcon } from 'lucide-react';
import { Button } from './button';

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  variant?: 'default' | 'outline';
  onClick?: () => void;
}

/** Toolbar action: icon and text on a wide screen, just the icon (with the label for screen readers) on a phone. */
export function ToolbarButton({ label, icon: Icon, variant = 'default', onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      className="h-10 max-md:w-11 max-md:px-0"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon aria-hidden />
      <span className="max-md:sr-only">{label}</span>
    </Button>
  );
}
