'use client';

import React from 'react';
import {
  RecommendationInitialState,
  WidgetDataType,
  useRecommendation,
  widget,
} from '@sitecore-search/react';
import type { ContentModel, IRecommendationSettings } from '@/types/search';
import { applySearchSources } from '@/lib/search/searchQuery';
import { DEFAULT_IMG_URL } from '@/constants/search';
import { SearchLink } from '@/components/non-sitecore/search/ui/search-link';
import { SearchImageFixed } from '@/components/non-sitecore/search/ui/search-image';
import Spinner from '@/components/non-sitecore/search/Spinner';

type HeroProps = {
  settings: IRecommendationSettings;
  params?: {
    Styles?: string;
    GridParameters?: string;
    RenderingIdentifier?: string;
  };
};

type InitialState = RecommendationInitialState<'itemsPerPage'>;

export const PersonalizedHeroComponent: React.FC<HeroProps> = ({ settings, params }) => {
  const containerStyles = params?.Styles ?? '';
  const styles = `${params?.GridParameters ?? ''} ${containerStyles}`.trim();
  const id = params?.RenderingIdentifier;

  const {
    widgetRef,
    queryResult: { isFetching, isLoading, data: { content: items = [] } = {} },
  } = useRecommendation<ContentModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      itemsPerPage: 1,
    },
  });

  const isLoaded = !isLoading && !isFetching;

  if (!items.length) {
    return null;
  }

  return (
    <div ref={widgetRef} className="relative">
      {!isLoaded && <Spinner loading />}
      {items.map((content) => {
        const validImageUrl = content.image_url?.trim() ? content.image_url : DEFAULT_IMG_URL;

        return (
          <section className={`component hero ${styles}`} id={id || undefined} key={content.id}>
            <div className="backdrop container mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
              <div className="component-content grid gap-16 md:flex md:flex-row">
                <div className="relative h-fit overflow-hidden rounded-2xl shadow-2xl">
                  <div className="relative max-w-[500px]">
                    <SearchImageFixed
                      src={validImageUrl}
                      alt={content.name}
                      width={500}
                      height={400}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
                <div className="flex min-w-0 flex-col gap-8 md:min-w-[50%]">
                  <h2 className="text-foreground text-4xl font-bold md:text-5xl lg:text-6xl">
                    {content.name}
                  </h2>
                  {content.description && (
                    <p className="text-foreground-light max-w-2xl text-xl">{content.description}</p>
                  )}
                  <div className="flex flex-row gap-3">
                    <SearchLink
                      href={content.url}
                      WidgetId={settings.SearchWidgetId}
                      Events={['EntityPageView']}
                      ItemIndex={0}
                      EntityID={content.id}
                      EntityType="content"
                      className="bg-accent hover:bg-accent/90 inline-block rounded-md px-5 py-2.5 text-white"
                    >
                      Learn More
                    </SearchLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default widget(PersonalizedHeroComponent, WidgetDataType.RECOMMENDATION, 'content');
