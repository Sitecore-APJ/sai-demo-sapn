'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseSearchSettings } from '@/lib/search/parseSearchParams';
import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import SearchListWidget from '@/components/non-sitecore/search/results/search-list';
import { CONTENT_LIST_WIDGET_ID } from '@/constants/search';

export const Default = (props: ComponentProps) => {
  const isAuthoring = useSearchAuthoring();
  const containerStyles = props.params?.Styles ? props.params.Styles : '';
  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const searchSettings = parseSearchSettings(props.params);
  const rfkId = searchSettings.SearchWidgetId || CONTENT_LIST_WIDGET_ID;

  if (isAuthoring) {
    return (
      <div className={`component content-list ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Content List" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component content-list ${styles}`} id={id || undefined}>
      <div className="component-content">
        <SearchListWidget settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
};
