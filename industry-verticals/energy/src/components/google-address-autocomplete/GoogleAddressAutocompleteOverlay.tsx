'use client';

import { useEffect } from 'react';
import type { Page } from '@sitecore-content-sdk/nextjs';
import { initAddressAutocomplete } from '@/lib/google-address-autocomplete/initAddressAutocomplete';

type GoogleAddressAutocompleteOverlayProps = {
  page?: Page;
};

export default function GoogleAddressAutocompleteOverlay({
  page,
}: GoogleAddressAutocompleteOverlayProps) {
  useEffect(() => {
    if (page?.mode?.isEditing) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return;
    }

    let teardown: (() => void) | undefined;

    initAddressAutocomplete()
      .then((cleanup) => {
        teardown = cleanup;
      })
      .catch((error: Error) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Google address autocomplete not initialized:', error.message);
        }
      });

    return () => {
      teardown?.();
    };
  }, [page?.mode?.isEditing]);

  return null;
}
