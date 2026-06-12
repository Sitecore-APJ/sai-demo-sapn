'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
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
import { Card, CardContent } from '@/shadcn/components/ui/card';
import Spinner from '@/components/non-sitecore/search/Spinner';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type RecommendationProps = {
  settings: IRecommendationSettings;
};

type InitialState = RecommendationInitialState<'itemsPerPage'>;

export const RecommendationComponent: React.FC<RecommendationProps> = ({ settings }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();

  const {
    widgetRef,
    actions: { onItemClick },
    queryResult: { isFetching, isLoading, data: { content: items = [] } = {} },
  } = useRecommendation<ContentModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      itemsPerPage: settings.NumberOfItems,
    },
  });

  const isLoaded = !isLoading && !isFetching;

  return (
    <div
      ref={widgetRef}
      className="relative m-2.5 overflow-hidden"
      key={router.asPath}
      data-route={router.asPath}
    >
      {settings.DisplayTitle && settings.Title && (
        <h4 className="text-foreground mb-6 text-2xl font-bold sm:text-4xl md:text-5xl">
          {settings.Title}
        </h4>
      )}

      {!isLoaded && <Spinner loading />}

      {items.length > 0 && (
        <div className="relative">
          <button
            type="button"
            aria-label="Previous slide"
            className="hover:bg-background-muted absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full p-2"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft className="size-8" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="hover:bg-background-muted absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full p-2"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight className="size-8" />
          </button>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={12}
            slidesPerView={1}
            pagination={{ clickable: true }}
            breakpoints={{
              370: { slidesPerView: 1, slidesPerGroup: 1 },
              768: { slidesPerView: 2, slidesPerGroup: 2 },
              1024: { slidesPerView: 3, slidesPerGroup: 3 },
              1280: { slidesPerView: 4, slidesPerGroup: 4 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="px-12"
          >
            {items.map((content, index) => {
              const validImageUrl = content.image_url?.trim() ? content.image_url : DEFAULT_IMG_URL;

              return (
                <SwiperSlide key={content.id}>
                  <Card className="border-border m-1 h-[300px] overflow-hidden py-0">
                    <div className="relative h-[180px] w-full">
                      <Image
                        src={validImageUrl}
                        alt={content.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <CardContent className="py-4">
                      <SearchLink
                        href={content.url}
                        WidgetId={settings.SearchWidgetId}
                        Events={['EntityPageView']}
                        onClick={(event) => {
                          event.preventDefault();
                          onItemClick({
                            id: content.id,
                            index,
                            sourceId: content.source_id,
                          });
                        }}
                        ItemIndex={index}
                        EntityID={content.id}
                        EntityType="content"
                        className="text-foreground text-sm font-semibold hover:underline"
                      >
                        {content.name}
                      </SearchLink>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default widget(RecommendationComponent, WidgetDataType.RECOMMENDATION, 'content');
