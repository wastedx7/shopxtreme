import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning-foreground border-warning/20',
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  SHIPPED: {
    label: 'Shipped',
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  DELIVERED: {
    label: 'Delivered',
    className: 'bg-success/10 text-success border-success/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
