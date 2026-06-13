'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Field, useSitecore } from '@sitecore-content-sdk/nextjs';
import { LayoutGrid, List, X } from 'lucide-react';
import {
  WidgetDataType,
  useSearchResults,
  useSearchResultsActions,
  useSearchResultsIsSelectedFacet,
  useSearchResultsSelectedFacets,
  widget,
  type SearchResponseFacet,
  type SearchResponseFacetItem,
  type SearchResultsInitialState,
  type SearchResultsStoreState,
} from '@sitecore-search/react';
import type { ContentModel, ISearchResultSettings } from '@/types/search';
import { useSearchContext } from '@/context/SearchContext';
import { applySearchSources } from '@/lib/search/searchQuery';
import { DEFAULT_IMG_URL } from '@/constants/search';
import { SearchLink } from '@/components/non-sitecore/search/ui/search-link';
import { FavouriteButton } from '@/components/non-sitecore/search/ui/favorite-button';
import { RadioCardGroup, RadioCardIcon } from '@/components/non-sitecore/search/ui/radio-card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/shadcn/components/ui/drawer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { SearchImage } from '@/components/non-sitecore/search/ui/search-image';
import Spinner from '@/components/non-sitecore/search/Spinner';

type ContentResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  settings: ISearchResultSettings;
};

type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page' | 'sortType'>;

type DrawerFacetValueButtonProps = {
  facet: SearchResponseFacet;
  facetIndex: number;
  value: SearchResponseFacetItem;
  valueIndex: number;
  onFacetClick: ReturnType<typeof useSearchResultsActions>['onFacetClick'];
};

function DrawerFacetValueButton({
  facet,
  facetIndex,
  value,
  valueIndex,
  onFacetClick,
}: DrawerFacetValueButtonProps) {
  const isSelected = useSearchResultsIsSelectedFacet(facet.name, value.id);

  return (
    <button
      type="button"
      onClick={() =>
        onFacetClick({
          facetId: facet.name,
          facetIndex,
          facetValueId: value.id,
          facetValueIndex: valueIndex,
          checked: !isSelected,
          type: 'valueId',
        })
      }
      className={`text-left text-sm hover:underline ${
        isSelected ? 'text-accent font-semibold' : 'text-foreground hover:text-accent'
      }`}
    >
      {value.text} {value.count ? `(${value.count})` : ''}
    </button>
  );
}

export const SearchResultsComponent: React.FC<ContentResultsProps> = ({ settings }) => {
  const { page } = useSitecore();
  const title = page.layout.sitecore.route?.fields?.Title as Field<string> | undefined;
  const defaultSortType = 'featured_desc';
  const defaultPage = 1;
  const defaultKeyphrase = settings.KeywordSearch
    ? settings.DefaultKeyword
    : settings.UsePageContext
      ? title?.value
      : '';

  const {
    widgetRef,
    actions: { onSortChange, onKeyphraseChange },
    state: { page: currentPage, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: items = [],
      } = {},
    },
  } = useSearchResults<ContentModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: settings.NumberOfItems,
      keyphrase: defaultKeyphrase ?? '',
    },
  });

  const [searchKeyphrase] = useSearchContext();
  useEffect(() => {
    if (settings.KeywordSearch) {
      onKeyphraseChange({ keyphrase: searchKeyphrase });
    }
  }, [onKeyphraseChange, searchKeyphrase, settings.KeywordSearch]);

  const { onFacetClick, onRemoveFilter, onClearFilters } = useSearchResultsActions();
  const selectedFacetsFromApi = useSearchResultsSelectedFacets();
  const [resultView, setResultView] = useState(settings.DefaultView || 'grid');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const numColumns = resultView === 'grid' ? settings.NumberOfColumns : 1;
  const isLoaded = !isLoading && !isFetching;
  const hasSelectedFilters = selectedFacetsFromApi.some((facet) => facet.values.length > 0);
  const resultsStart = totalItems === 0 ? 0 : itemsPerPage * (currentPage - 1) + 1;
  const resultsEnd = totalItems === 0 ? 0 : itemsPerPage * (currentPage - 1) + items.length;

  return (
    <div ref={widgetRef} className="relative m-2">
      {isLoading && <Spinner loading />}
      {isFetching && !isLoading && (
        <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center">
          <Spinner loading />
        </div>
      )}

      {settings.AllowFilters && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="left">
          <DrawerContent className="data-[vaul-drawer-direction=left]:sm:max-w-md">
            <DrawerHeader>
              <div className="flex items-center justify-between gap-2 pr-8">
                <DrawerTitle>Filters</DrawerTitle>
                {hasSelectedFilters && (
                  <button
                    type="button"
                    onClick={() => onClearFilters()}
                    className="text-accent hover:text-accent-dark text-sm font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <DrawerClose className="text-foreground-light hover:text-foreground absolute top-4 right-4">
                <X className="size-4" />
              </DrawerClose>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto p-4">
              {selectedFacetsFromApi.map((selectedFacet) => (
                <Card key={`${selectedFacet.id}${selectedFacet.name}`}>
                  <CardHeader>
                    <CardTitle className="text-base">{selectedFacet.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {selectedFacet.values.map((facet) => (
                      <button
                        type="button"
                        key={`${facet.facetId}${facet.facetLabel}${facet.valueLabel}`}
                        onClick={() =>
                          onRemoveFilter({
                            type: facet.type,
                            facetId: facet.facetId,
                            facetValueId: 'facetValueId' in facet ? facet.facetValueId : undefined,
                            facetValueText:
                              'facetValueText' in facet ? facet.facetValueText : undefined,
                          })
                        }
                        className="bg-background-accent text-accent-dark border-accent inline-flex items-center gap-1 rounded border px-3 py-1 text-sm"
                      >
                        {facet.facetLabel}: {facet.valueLabel}
                        <X className="size-3" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              ))}
              {facets.map((f, facetIndex) => (
                <Card key={`${f.label}${f.name}`} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">{f.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-start gap-2">
                    {f.value.map((v, valueIndex) => (
                      <DrawerFacetValueButton
                        key={v.id}
                        facet={f}
                        facetIndex={facetIndex}
                        value={v}
                        valueIndex={valueIndex}
                        onFacetClick={onFacetClick}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {settings.DisplayHeader && (
        <>
          <div className="border-border flex flex-col items-center gap-2 rounded-md border p-5 md:flex-row">
            <div className="p-2">
              <h2 className="text-foreground text-lg font-semibold">
                Showing {resultsStart} - {resultsEnd} of {totalItems} results
              </h2>
            </div>
            <div className="flex-1" />
            <div className="flex flex-wrap items-center gap-2">
              {settings.AllowFilters && (
                <button
                  ref={btnRef}
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="main-btn min-h-[58px]"
                >
                  Filter
                </button>
              )}
              {sortChoices.length > 0 && (
                <select
                  className="border-border text-foreground min-h-[58px] rounded-md border px-4"
                  onChange={(e) => onSortChange({ name: e.currentTarget.value })}
                >
                  {sortChoices.map((sortChoice) => (
                    <option key={sortChoice.name} value={sortChoice.name}>
                      {sortChoice.label}
                    </option>
                  ))}
                </select>
              )}
              {settings.DisplayViewToggle && (
                <RadioCardGroup
                  name="resultView"
                  defaultValue={settings.DefaultView || 'grid'}
                  onChange={setResultView}
                >
                  <RadioCardIcon value="grid">
                    <LayoutGrid className="size-8" />
                  </RadioCardIcon>
                  <RadioCardIcon value="list">
                    <List className="size-8" />
                  </RadioCardIcon>
                </RadioCardGroup>
              )}
            </div>
          </div>
          <hr className="border-border my-2" />
        </>
      )}

      {isLoaded && items.length === 0 ? (
        <p className="text-foreground-light py-8 text-center text-sm">No results found.</p>
      ) : (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))` }}
        >
          {items.map((content, index) => {
            const validImageUrl = content.image_url?.trim() ? content.image_url : DEFAULT_IMG_URL;

            return (
              <Card
                key={content.id}
                className={`border-border overflow-hidden py-0 ${
                  resultView === 'list' ? 'md:flex-row' : 'flex-col'
                }`}
              >
                {settings.DisplayImage && (
                  <div
                    className={`relative shrink-0 ${
                      resultView === 'list' ? 'h-40 w-40' : 'aspect-[4/3] w-full'
                    }`}
                  >
                    <SearchImage src={validImageUrl} alt={content.name} fit="contain" />
                  </div>
                )}
                <CardContent className="relative flex flex-col gap-2 py-4">
                  <SearchLink
                    href={content.url}
                    WidgetId={settings.SearchWidgetId}
                    Events={['EntityPageView', 'PreviewSearchClickEvent']}
                    ItemIndex={index}
                    EntityID={content.id}
                    EntityType="content"
                    className="text-foreground hover:underline"
                  >
                    <h3 className="text-lg font-semibold">{content.name}</h3>
                  </SearchLink>
                  {settings.DisplayAddToFavourites && (
                    <FavouriteButton
                      className="absolute top-2 right-2"
                      aria-label={`Add ${content.name} to your favourites`}
                    />
                  )}
                  {settings.DisplayContentType && content.type && (
                    <span className="border-accent bg-background-accent inline-block w-fit rounded border px-2 py-0.5 text-xs text-white capitalize">
                      {content.type}
                    </span>
                  )}
                  {content.description && (
                    <p className="text-foreground-light text-sm">{content.description}</p>
                  )}
                </CardContent>
                <CardFooter className="mt-auto pb-4">
                  <SearchLink
                    href={content.url}
                    WidgetId={settings.SearchWidgetId}
                    Events={['EntityPageView', 'PreviewSearchClickEvent']}
                    ItemIndex={index}
                    EntityID={content.id}
                    EntityType="content"
                    className="bg-accent hover:bg-accent/90 inline-block rounded-md px-4 py-2 text-sm text-white"
                  >
                    {settings.CTAButtonText}
                  </SearchLink>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default widget(SearchResultsComponent, WidgetDataType.SEARCH_RESULTS, 'content');
