'use client';

import React, { useCallback, useEffect } from 'react';
import {
  WidgetDataType,
  usePreviewSearch,
  widget,
  type PreviewSearchInitialState,
} from '@sitecore-search/react';
import type { ContentModel, ISuggestionSettings } from '@/types/search';
import { usePreviewKeyphrase, useSearchContext } from '@/context/SearchContext';
import { applySearchSources } from '@/lib/search/searchQuery';
import Spinner from '@/components/non-sitecore/search/Spinner';

type InitialState = PreviewSearchInitialState<'itemsPerPage' | 'suggestionsList'>;

interface SuggestionsProps {
  settings: ISuggestionSettings;
}

let keyphrase = '';

export const ContentSuggestionComponent: React.FC<SuggestionsProps> = ({ settings }) => {
  const [searchKeyphrase, setSearchKeyphrase] = useSearchContext();
  const [, setPreviewKeyphrase] = usePreviewKeyphrase();
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
    if (keyphrase !== searchKeyphrase) {
      keyphrase = searchKeyphrase;
      onKeyphraseChange({ keyphrase });
    }
  }, [onKeyphraseChange, searchKeyphrase]);

  const handleSuggestionMouseEnter = useCallback(
    (text: string) => {
      setPreviewKeyphrase(text);
    },
    [setPreviewKeyphrase]
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      setSearchKeyphrase(text);
      setPreviewKeyphrase(text);
    },
    [setPreviewKeyphrase, setSearchKeyphrase]
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
      <ul className="flex flex-col gap-3">
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
