import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export function StarRating({ rating, onChange, size = 'md', interactive = false }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        const isFilled = value <= rating;

        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onChange?.(value)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? 'fill-current rating-star' : 'text-muted-foreground/30'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
