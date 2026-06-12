import { Star } from 'lucide-react';
import type { HTMLAttributes } from 'react';

interface RatingProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
};

export const Rating = ({
  defaultValue = 0,
  max = 5,
  size = 'md',
  className = '',
  ...rootProps
}: RatingProps) => {
  const iconSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-0.5 ${className}`} {...rootProps}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= defaultValue;

        return (
          <Star
            key={starValue}
            className={`${iconSize} ${isActive ? 'fill-accent text-accent' : 'text-foreground-light'}`}
          />
        );
      })}
    </div>
  );
};
