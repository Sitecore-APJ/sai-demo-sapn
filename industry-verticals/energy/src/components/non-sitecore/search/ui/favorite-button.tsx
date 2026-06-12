'use client';

import { Heart } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

type FavouriteButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const FavouriteButton = ({ className = '', ...props }: FavouriteButtonProps) => (
  <button
    type="button"
    className={`bg-background text-foreground rounded-full p-2 shadow-sm transition-all duration-150 hover:scale-110 ${className}`}
    {...props}
  >
    <Heart className="size-4" />
  </button>
);
