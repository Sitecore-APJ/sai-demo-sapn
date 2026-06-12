'use client';

import React, { useEffect } from 'react';
import {
  WidgetDataType,
  usePreviewSearch,
  widget,
  type PreviewSearchInitialState,
} from '@sitecore-search/react';
import type { ContentModel, ISearchSettings } from '@/types/search';
import { useSearchContext } from '@/context/SearchContext';
import { applySearchSources } from '@/lib/search/searchQuery';
import { GridView } from '@/components/non-sitecore/search/ui/grid-view';
import { ContentCard } from '@/components/non-sitecore/search/preview/content-card';
import Spinner from '@/components/non-sitecore/search/Spinner';

type InitialState = PreviewSearchInitialState<'itemsPerPage'>;

interface ContentTilesProps {
  settings: ISearchSettings;
}

let keyphrase = '';

export const ContentTilesComponent: React.FC<ContentTilesProps> = ({ settings }) => {
  const [searchKeyphrase] = useSearchContext();
  const {
    widgetRef,
    actions: { onKeyphraseChange },
    queryResult: { isFetching, isLoading, data: { content: items = [] } = {} },
  } = usePreviewSearch<ContentModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      itemsPerPage: settings.NumberOfItems,
    },
  });

  useEffect(() => {
    if (keyphrase !== searchKeyphrase) {
      keyphrase = searchKeyphrase;
      onKeyphraseChange({ keyphrase });
    }
  }, [onKeyphraseChange, searchKeyphrase]);

  const isLoaded = !isLoading && !isFetching;

  if (!items.length) {
    return null;
  }

  return (
    <div ref={widgetRef} className="relative">
      {!isLoaded && <Spinner loading />}
      {settings.DisplayTitle && settings.Title && (
        <h4 className="text-foreground mb-4 text-lg font-semibold">{settings.Title}</h4>
      )}
      <GridView>
        {items.map((content, index) => (
          <ContentCard key={content.id} itemIndex={index} content={content} settings={settings} />
        ))}
      </GridView>
    </div>
  );
};

export default widget(ContentTilesComponent, WidgetDataType.PREVIEW_SEARCH, 'content');
