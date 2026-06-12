'use client';

import type { ContentModel, ISearchSettings } from '@/types/search';
import { DEFAULT_IMG_URL } from '@/constants/search';
import { FavouriteButton } from '@/components/non-sitecore/search/ui/favorite-button';
import { Rating } from '@/components/non-sitecore/search/ui/rating';
import { SearchLink } from '@/components/non-sitecore/search/ui/search-link';
import { SearchImage } from '@/components/non-sitecore/search/ui/search-image';

export interface ContentCardProps {
  content: ContentModel;
  settings: ISearchSettings;
  itemIndex: number;
  className?: string;
}

export const ContentCard = ({ content, settings, itemIndex, className = '' }: ContentCardProps) => {
  const { id, name, url, image_url, type, review_rating, description } = content;
  const validImageUrl = image_url?.trim() ? image_url : DEFAULT_IMG_URL;

  return (
    <div className={`flex flex-col gap-4 md:gap-5 ${className}`}>
      <article className="relative rounded-md p-2">
        {settings.DisplayImage && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md md:rounded-xl">
            <SearchImage src={validImageUrl} alt={name} />
          </div>
        )}
        {settings.DisplayContentType && type && (
          <span
            className={`bg-accent inline-block rounded px-2 py-1 text-xs font-medium text-white capitalize ${
              settings.DisplayImage ? 'absolute top-4 left-4' : 'relative mb-4'
            }`}
          >
            {type}
          </span>
        )}
        {settings.DisplayAddToFavourites && (
          <FavouriteButton
            className="absolute top-4 right-4"
            aria-label={`Add ${name} to your favourites`}
          />
        )}
        <div className="mt-2 flex flex-col gap-2">
          <SearchLink
            href={url}
            WidgetId={settings.SearchWidgetId}
            Events={['EntityPageView', 'PreviewSearchClickEvent']}
            ItemIndex={itemIndex}
            EntityID={id}
            EntityType="content"
            className="text-foreground font-medium hover:underline"
          >
            {name}
          </SearchLink>
          {description && (
            <p className="text-foreground-light line-clamp-3 text-sm">{description}</p>
          )}
          {settings.DisplayRatings && review_rating !== undefined && (
            <Rating defaultValue={review_rating} size="sm" />
          )}
        </div>
      </article>
    </div>
  );
};
