'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useSearchTracking, type Events } from '@/hooks/useSearchTracking';

export type SearchLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href?: string;
  WidgetId: string;
  EntityType: string;
  Events: Events[];
  EntityID: string;
  ItemIndex: number;
};

export const SearchLink = ({
  WidgetId,
  EntityType,
  Events: events,
  EntityID,
  ItemIndex,
  href = '',
  onClick,
  children,
  ...rest
}: SearchLinkProps) => {
  const { handleSearch } = useSearchTracking();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      handleSearch(e, {
        url: href,
        widgetId: WidgetId,
        entityType: EntityType,
        events,
        entityId: EntityID,
        itemIndex: ItemIndex,
      });
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
