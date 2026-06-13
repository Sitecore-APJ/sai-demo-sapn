'use client';

import React from 'react';
import {
  WidgetDataType,
  useSearchResults,
  widget,
  type SearchResultsInitialState,
  type SearchResultsStoreState,
} from '@sitecore-search/react';
import type { ContentModel, ISearchSettings } from '@/types/search';
import { applySearchSources } from '@/lib/search/searchQuery';
import { DEFAULT_IMG_URL } from '@/constants/search';
import { SearchLink } from '@/components/non-sitecore/search/ui/search-link';
import { FavouriteButton } from '@/components/non-sitecore/search/ui/favorite-button';
import { Rating } from '@/components/non-sitecore/search/ui/rating';
import Spinner from '@/components/non-sitecore/search/Spinner';
import { SearchImage } from '@/components/non-sitecore/search/ui/search-image';

type ContentResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  settings: ISearchSettings;
};

type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page' | 'sortType'>;

export const SearchListComponent: React.FC<ContentResultsProps> = ({ settings }) => {
  const defaultSortType = 'featured_desc';
  const defaultPage = 1;

  const {
    widgetRef,
    queryResult: { isLoading, isFetching, data: { content: items = [] } = {} },
  } = useSearchResults<ContentModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: settings.NumberOfItems,
      keyphrase: '',
    },
  });

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
      <ul className="flex flex-col gap-1">
        {items.map((content, index) => {
          const validImageUrl = content.image_url?.trim() ? content.image_url : DEFAULT_IMG_URL;

          return (
            <li key={content.id}>
              <article className="border-border relative rounded-md border p-2">
                <div className="flex flex-row gap-5">
                  {settings.DisplayImage && (
                    <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden">
                      <SearchImage src={validImageUrl} alt={content.name} />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-baseline gap-2">
                      <SearchLink
                        href={content.url}
                        WidgetId={settings.SearchWidgetId}
                        Events={['EntityPageView', 'PreviewSearchClickEvent']}
                        ItemIndex={index}
                        EntityID={content.id}
                        EntityType="content"
                        className="text-foreground text-sm font-medium hover:underline"
                      >
                        {content.name}
                      </SearchLink>
                      {settings.DisplayAddToFavourites && (
                        <FavouriteButton
                          className="absolute top-2 right-2"
                          aria-label={`Add ${content.name} to your favourites`}
                        />
                      )}
                      {settings.DisplayContentType && content.type && (
                        <span className="border-accent bg-background-accent shrink-0 rounded border px-2 py-0.5 text-xs text-white capitalize">
                          {content.type}
                        </span>
                      )}
                    </div>
                    {content.description && (
                      <p className="text-foreground-light line-clamp-2 text-sm">
                        {content.description}
                      </p>
                    )}
                    {settings.DisplayRatings && content.review_rating !== undefined && (
                      <Rating defaultValue={content.review_rating} size="sm" />
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default widget(SearchListComponent, WidgetDataType.SEARCH_RESULTS, 'content');
