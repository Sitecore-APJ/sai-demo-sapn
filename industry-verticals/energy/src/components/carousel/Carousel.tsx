'use client';

import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { ComponentProps } from '@/lib/component-props';
import { paramFlag, paramInt } from '@/lib/search/parseSearchParams';

interface CarouselComponentProps extends ComponentProps {
  params: ComponentProps['params'] & {
    EnabledPlaceholders?: string;
    DisplayDots?: string;
    Fade?: string;
    Infinite?: string;
    Autoplay?: string;
    Speed?: string;
    AutoplaySpeed?: string;
    SlidesToShow?: string;
    SlidesToScroll?: string;
    SwipeToSlide?: string;
  };
}

function getSlideClassName(index: number, total: number) {
  let className = `slide${index}`;
  className += (index + 1) % 2 === 0 ? ' even' : ' odd';
  if (index === 0) {
    className += ' first';
  }
  if (index + 1 === total) {
    className += ' last';
  }
  return className;
}

export const Default = ({ rendering, params }: CarouselComponentProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const swiperRef = useRef<SwiperType | null>(null);
  const enabledPlaceholders = (params.EnabledPlaceholders ?? '').split(',').filter(Boolean);
  const id = params.RenderingIdentifier;
  const styles = `component carousel ${params.styles ?? ''}`.trimEnd();

  if (!enabledPlaceholders.length) {
    return isEditing ? (
      <div className={styles} id={id}>
        <div className="component-content">[Carousel]</div>
      </div>
    ) : null;
  }

  const fade = paramFlag(params.Fade as string, true);
  const loop = paramFlag(params.Infinite as string, true);
  const autoplay = paramFlag(params.Autoplay as string, true);
  const pagination = paramFlag(params.DisplayDots as string, true);
  const speed = paramInt(params.Speed as string, 500);
  const autoplaySpeed = paramInt(params.AutoplaySpeed as string, 3000);
  const slidesPerView = paramInt(params.SlidesToShow as string, 1);
  const slidesPerGroup = paramInt(params.SlidesToScroll as string, 1);

  return (
    <div className={`${styles} relative min-h-[100px] w-full overflow-hidden`} id={id || undefined}>
      <button
        type="button"
        aria-label="Previous slide"
        className="hover:bg-background-muted absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full p-2 md:left-4"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <ChevronLeft className="size-8" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className="hover:bg-background-muted absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-2 md:right-4"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <ChevronRight className="size-8" />
      </button>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        effect={fade ? 'fade' : undefined}
        loop={loop}
        speed={speed}
        slidesPerView={slidesPerView}
        slidesPerGroup={slidesPerGroup}
        allowTouchMove={paramFlag(params.SwipeToSlide as string, true)}
        autoplay={
          autoplay
            ? {
                delay: autoplaySpeed,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={pagination ? { clickable: true } : false}
        className="w-full"
      >
        {enabledPlaceholders.map((ph, index) => {
          const phKey = `carouselcolumn-${ph}-{*}`;
          const className = getSlideClassName(index, enabledPlaceholders.length);

          return (
            <SwiperSlide key={index} className={className}>
              <Placeholder name={phKey} rendering={rendering} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
