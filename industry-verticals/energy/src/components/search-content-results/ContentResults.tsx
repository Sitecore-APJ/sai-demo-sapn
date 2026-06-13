'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseSearchResultSettings } from '@/lib/search/parseSearchParams';
import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import SearchResultWidget from '@/components/non-sitecore/search/results/search-result';
import { CONTENT_RESULTS_WIDGET_ID } from '@/constants/search';

export const Default = (props: ComponentProps) => {
  const isAuthoring = useSearchAuthoring();
  const containerStyles = props.params?.Styles ? props.params.Styles : '';
  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const searchSettings = parseSearchResultSettings(props.params);
  const rfkId = searchSettings.SearchWidgetId || CONTENT_RESULTS_WIDGET_ID;

  if (isAuthoring) {
    return (
      <div className={`component content-results ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Content Results" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component content-results ${styles}`} id={id || undefined}>
      <div className="component-content">
        <SearchResultWidget settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
};
