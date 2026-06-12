'use client';

import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState, type KeyboardEvent, type SyntheticEvent } from 'react';

import { ComponentProps } from '@/lib/component-props';
import { paramFlag, paramInt } from '@/lib/search/parseSearchParams';
import { useSearchContext } from '@/context/SearchContext';
import SearchInput from '@/components/non-sitecore/search/preview/search-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';

export const Default = (props: ComponentProps) => {
  const router = useRouter();
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const phKey = `previewSearch-${props.params.DynamicPlaceholderId ?? 'default'}`;
  const id = props.params.RenderingIdentifier;
  const styles = `component search-bar ${props.params.styles ?? ''}`.trimEnd();

  const searchSettings = {
    MinCharacters: paramInt(props.params.MinCharacters as string, 3),
    DisplayHeader: paramFlag(props.params.DisplayHeader as string, true),
    HeaderPreText: (props.params.HeaderPreText as string) || 'Top Results For',
  };

  const [searchKeyphrase, setSearchKeyphrase] = useSearchContext();
  const [isShowingResult, setIsShowingResult] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  const onReset = useCallback(() => {
    setSearchKeyphrase('');
    setShowHeader(false);
  }, [setSearchKeyphrase]);

  const onSearch = useCallback(
    (searchInput: string) => {
      if (searchInput.length === 0) {
        onReset();
      } else if (searchInput.length < searchSettings.MinCharacters) {
        setShowHeader(false);
      } else if (searchKeyphrase !== searchInput) {
        setSearchKeyphrase(searchInput);
      }
    },
    [searchSettings.MinCharacters, searchKeyphrase, onReset, setSearchKeyphrase]
  );

  const handleKeyphraseChange = (e: KeyboardEvent<HTMLInputElement>) => {
    onSearch(e.currentTarget.value);
  };

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
      setSearchKeyphrase(decodeURIComponent(urlQuery));
    }
  }, [setSearchKeyphrase]);

  useEffect(() => {
    if (searchKeyphrase.length >= searchSettings.MinCharacters) {
      setShowHeader(true);
    }
  }, [searchKeyphrase, searchSettings.MinCharacters]);

  if (isEditing) {
    return (
      <div className={`${styles} w-full py-5`} id={id || undefined}>
        <div className="component-content">
          <SearchInput
            placeholder="Search"
            onReset={onReset}
            onKeyUp={handleKeyphraseChange}
            onFocus={() => setIsShowingResult(true)}
          />
          {isShowingResult && <Placeholder name={phKey} rendering={props.rendering} />}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles} w-full py-5`} id={id || undefined}>
      <div className="component-content">
        <Popover open={isShowingResult} onOpenChange={setIsShowingResult}>
          <PopoverTrigger asChild>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <SearchInput
                name="query"
                placeholder="Search"
                onReset={onReset}
                onKeyUp={handleKeyphraseChange}
                onFocus={() => setIsShowingResult(true)}
              />
            </form>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            {searchSettings.DisplayHeader && showHeader && (
              <div className="border-border border-b px-4 py-2 text-sm font-semibold">
                {searchSettings.HeaderPreText} &apos;{searchKeyphrase}&apos;
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
