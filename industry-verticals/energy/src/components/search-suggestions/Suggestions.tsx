'use client';

import { ComponentProps } from '@/lib/component-props';

import { parseSuggestionSettings } from '@/lib/search/parseSearchParams';

import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';

import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';

import SuggestionWidget from '@/components/non-sitecore/search/preview/content-suggestion-widget';

export const Default = (props: ComponentProps) => {
  const isAuthoring = useSearchAuthoring();

  const containerStyles = props.params?.Styles ? props.params.Styles : '';

  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();

  const id = props.params.RenderingIdentifier;

  const searchSettings = parseSuggestionSettings(
    props.params,

    props.rendering?.params as ComponentProps['params'] | undefined
  );

  const rfkId = searchSettings.SearchWidgetId;

  if (isAuthoring) {
    return (
      <div className={`component suggestions-default ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Suggestions" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component suggestions-default ${styles}`} id={id || undefined}>
      <div className="component-content">
        <SuggestionWidget key={rfkId} settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
};
