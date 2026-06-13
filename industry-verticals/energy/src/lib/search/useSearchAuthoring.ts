'use client';

import { useSitecore } from '@sitecore-content-sdk/nextjs';

export function useSearchAuthoring(): boolean {
  const { page } = useSitecore();
  const { mode, layout } = page;

  // Align with Content SDK Placeholder, which keys off isEditing for Page Builder chromes.
  return mode.isEditing || layout?.sitecore?.context?.pageEditing === true;
}
