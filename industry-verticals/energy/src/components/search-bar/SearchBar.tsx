'use client';

import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { useRouter } from 'next/router';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';

import { ComponentProps } from '@/lib/component-props';
import { paramFlag, paramInt } from '@/lib/search/parseSearchParams';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import { usePreviewKeyphrase, useSearchContext } from '@/context/SearchContext';
import SearchInput from '@/components/non-sitecore/search/preview/search-input';
import { Popover, PopoverAnchor, PopoverContent } from '@/shadcn/components/ui/popover';

export const Default = (props: ComponentProps) => {
  const router = useRouter();
  const isAuthoring = useSearchAuthoring();
  const phKey = `previewSearch-${props.params.DynamicPlaceholderId ?? 'default'}`;
  const id = props.params.RenderingIdentifier;
  const styles = `component search-bar ${props.params.styles ?? ''}`.trimEnd();

  const searchSettings = {
    MinCharacters: paramInt(props.params.MinCharacters as string, 3),
    DisplayHeader: paramFlag(props.params.DisplayHeader as string, true),
    HeaderPreText: (props.params.HeaderPreText as string) || 'Top Results For',
  };

  const [searchKeyphrase, setSearchKeyphrase] = useSearchContext();
  const [previewKeyphrase, setPreviewKeyphrase] = usePreviewKeyphrase();
  const [isShowingResult, setIsShowingResult] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const anchorRef = useRef<HTMLFormElement>(null);

  const onReset = useCallback(() => {
    setSearchKeyphrase('');
    setPreviewKeyphrase('');
    setShowHeader(false);
  }, [setPreviewKeyphrase, setSearchKeyphrase]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setIsShowingResult(true);
      setShowHeader(value.length >= searchSettings.MinCharacters);
    },
    [searchSettings.MinCharacters]
  );

  const handleOpenSearch = useCallback(() => {
    setIsShowingResult(true);
  }, []);

  const handleSearchSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget.query as HTMLInputElement;
    router.push(`/search?q=${target.value}`);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const urlQuery = new URLSearchParams(window.location.search).get('q');
    if (urlQuery) {
      const decoded = decodeURIComponent(urlQuery);
      setSearchKeyphrase(decoded);
      setPreviewKeyphrase(decoded);
    }
  }, [setPreviewKeyphrase, setSearchKeyphrase]);

  useEffect(() => {
    if (searchKeyphrase.length >= searchSettings.MinCharacters) {
      setShowHeader(true);
    }
  }, [searchKeyphrase, searchSettings.MinCharacters]);

  if (isAuthoring) {
    return (
      <div className={`${styles} w-full py-5`} id={id || undefined}>
        <div className="component-content">
          <div
            aria-hidden
            className="border-border bg-background text-foreground-light rounded-md border px-10 py-2 text-base select-none"
          >
            Search
          </div>
          <p className="text-foreground-light mt-4 mb-2 text-xs font-medium">
            Preview search components
          </p>
          <Placeholder name={phKey} rendering={props.rendering} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles} w-full py-5`} id={id || undefined}>
      <div className="component-content">
        <Popover open={isShowingResult} onOpenChange={setIsShowingResult}>
          <PopoverAnchor asChild>
            <form ref={anchorRef} onSubmit={handleSearchSubmit} className="w-full">
              <SearchInput
                name="query"
                placeholder="Search"
                onReset={onReset}
                onChange={handleInputChange}
                onFocus={handleOpenSearch}
              />
            </form>
          </PopoverAnchor>
          <PopoverContent
            className="w-[var(--radix-popover-anchor-width,var(--radix-popover-trigger-width))] p-0"
            align="start"
            onOpenAutoFocus={(event) => event.preventDefault()}
            onFocusOutside={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (anchorRef.current?.contains(event.target as Node)) {
                event.preventDefault();
              }
            }}
          >
            {searchSettings.DisplayHeader && showHeader && (
              <div className="border-border border-b px-4 py-2 text-sm font-semibold">
                {searchSettings.HeaderPreText} &apos;{previewKeyphrase}&apos;
              </div>
            )}
            <div className="p-2">
              <Placeholder name={phKey} rendering={props.rendering} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
