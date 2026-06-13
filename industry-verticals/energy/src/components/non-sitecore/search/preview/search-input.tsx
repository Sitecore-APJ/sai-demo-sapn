'use client';

import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { usePreviewKeyphrase, useSearchContext } from '@/context/SearchContext';

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  placeholder?: string;
  icon?: React.ReactNode;
  resetIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onReset?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = 'md',
      icon,
      resetIcon,
      rightElement,
      onReset,
      placeholder = 'Search',
      className = '',
      onChange,
      ...inputProps
    },
    ref
  ) => {
    const [searchKeyphrase, setSearchKeyphrase] = useSearchContext();
    const [, setPreviewKeyphrase] = usePreviewKeyphrase();
    const [showReset, setShowReset] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
      setSearchInput(searchKeyphrase);
      setShowReset(searchKeyphrase !== '');
    }, [searchKeyphrase]);

    const sizeClasses = {
      sm: 'h-9 text-sm px-9',
      md: 'h-10 text-base px-10',
      lg: 'h-12 text-lg px-12',
    };

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowReset(e.target.value !== '');
        setSearchInput(e.target.value);
        setSearchKeyphrase(e.target.value);
        setPreviewKeyphrase(e.target.value);
        onChange?.(e);
      },
      [onChange, setPreviewKeyphrase, setSearchKeyphrase]
    );

    const handleReset = useCallback(() => {
      setSearchInput('');
      setShowReset(false);
      setSearchKeyphrase('');
      setPreviewKeyphrase('');
      onReset?.();
    }, [onReset, setPreviewKeyphrase, setSearchKeyphrase]);

    return (
      <div className="relative w-full">
        <span className="text-foreground-light pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          {icon ?? <Search className="size-4" />}
        </span>
        <input
          type="text"
          autoComplete="off"
          ref={ref}
          placeholder={placeholder}
          value={searchInput}
          onChange={handleChange}
          className={`border-border bg-background text-foreground focus:ring-accent w-full rounded-md border py-2 focus:border-transparent focus:ring-2 focus:outline-none ${sizeClasses[size]} ${className}`}
          {...inputProps}
        />
        <span className="absolute top-1/2 right-2 -translate-y-1/2">
          {showReset ? (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset search"
              className="text-foreground-light hover:text-foreground rounded p-1"
            >
              {resetIcon ?? <X className="size-4" />}
            </button>
          ) : (
            rightElement
          )}
        </span>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
