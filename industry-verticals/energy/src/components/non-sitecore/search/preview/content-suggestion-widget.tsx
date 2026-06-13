'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import {
  WidgetDataType,
  usePreviewSearch,
  widget,
  type PreviewSearchInitialState,
} from '@sitecore-search/react';
import type { ContentModel, ISuggestionSettings } from '@/types/search';
import { useSearchContext } from '@/context/SearchContext';
import { applySearchSources } from '@/lib/search/searchQuery';
import Spinner from '@/components/non-sitecore/search/Spinner';

type InitialState = PreviewSearchInitialState<'itemsPerPage' | 'suggestionsList'>;

interface SuggestionsProps {
  settings: ISuggestionSettings;
}

let keyphrase = '';

export const ContentSuggestionComponent: React.FC<SuggestionsProps> = ({ settings }) => {
  const [searchKeyphrase, setSearchKeyphrase] = useSearchContext();
  const isHoveringSuggestionRef = useRef(false);
  const typedKeyphraseRef = useRef(searchKeyphrase);
  const {
    widgetRef,
    actions: { onKeyphraseChange },
    queryResult: { isFetching, isLoading, data: { suggestion: suggestionResult = {} } = {} },
  } = usePreviewSearch<ContentModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      itemsPerPage: 1,
      suggestionsList: [{ suggestion: settings.SuggestionAttribute, max: settings.NumberOfItems }],
    },
  });

  useEffect(() => {
    if (!isHoveringSuggestionRef.current) {
      typedKeyphraseRef.current = searchKeyphrase;
    }
  }, [searchKeyphrase]);

  useEffect(() => {
    if (keyphrase !== searchKeyphrase) {
      keyphrase = searchKeyphrase;
      onKeyphraseChange({ keyphrase });
    }
  }, [onKeyphraseChange, searchKeyphrase]);

  const handleSuggestionMouseEnter = useCallback(
    (text: string) => {
      isHoveringSuggestionRef.current = true;
      setSearchKeyphrase(text);
    },
    [setSearchKeyphrase]
  );

  const handleSuggestionsMouseLeave = useCallback(() => {
    isHoveringSuggestionRef.current = false;
    setSearchKeyphrase(typedKeyphraseRef.current);
  }, [setSearchKeyphrase]);

  const handleSuggestionClick = useCallback(
    (text: string) => {
      typedKeyphraseRef.current = text;
      isHoveringSuggestionRef.current = false;
      setSearchKeyphrase(text);
    },
    [setSearchKeyphrase]
  );

  const suggestions = suggestionResult[settings.SuggestionAttribute] as
    | Array<{ text: string; freq?: number }>
    | undefined;
  const isLoaded = !isLoading && !isFetching;

  if (!suggestions?.length) {
    return null;
  }

  return (
    <div ref={widgetRef} className="relative">
      {!isLoaded && <Spinner loading />}
      {settings.DisplayTitle && settings.Title && (
        <h4 className="text-foreground mb-4 text-lg font-semibold">{settings.Title}</h4>
      )}
      <ul className="flex flex-col gap-3" onMouseLeave={handleSuggestionsMouseLeave}>
        {suggestions.map(({ text, freq }, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => handleSuggestionClick(text)}
              onMouseEnter={() => handleSuggestionMouseEnter(text)}
              className="text-foreground hover:text-accent w-full text-left text-sm hover:underline"
            >
              {text}
              {settings.DisplayFrequency && freq !== undefined && (
                <span className="bg-background-muted text-foreground-light ml-2 rounded px-2 py-0.5 text-xs">
                  {freq}
                </span>
              )}
            </button>
            <hr className="border-border mt-3" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default widget(ContentSuggestionComponent, WidgetDataType.PREVIEW_SEARCH, 'content');
