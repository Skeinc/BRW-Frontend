import type { ReactNode } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface AnalyticsCardProps {
  title: string;
  description?: string;
  /** Control at the right end of the header, for example a sort switch. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AnalyticsCard({ title, description, action, children, className }: AnalyticsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
    </Card>
  );
}
