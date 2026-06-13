'use client';

import { ComponentProps } from '@/lib/component-props';
import { paramFlag, paramInt } from '@/lib/search/parseSearchParams';
import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import type { ISuggestionSettings } from '@/types/search';
import SuggestionWidget from '@/components/non-sitecore/search/preview/content-suggestion-widget';
import { SUGGESTIONS_WIDGET_ID } from '@/constants/search';

export const Default = (props: ComponentProps) => {
  const isAuthoring = useSearchAuthoring();
  const containerStyles = props.params?.Styles ? props.params.Styles : '';
  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const searchSettings: ISuggestionSettings = {
    SearchWidgetId: (props.params.SearchWidgetId as string) || SUGGESTIONS_WIDGET_ID,
    NumberOfItems: paramInt(props.params.NumberOfItems as string, 6),
    DisplayFrequency: paramFlag(props.params.DisplayFrequency as string, false),
    SuggestionAttribute: (props.params.SuggestionAttribute as string) || 'title_context_aware',
    Title: (props.params.Title as string) || 'Related Questions',
    DisplayTitle: paramFlag(props.params.DisplayTitle as string, false),
  };

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
        <SuggestionWidget settings={searchSettings} rfkId={searchSettings.SearchWidgetId} />
      </div>
    </div>
  );
};
