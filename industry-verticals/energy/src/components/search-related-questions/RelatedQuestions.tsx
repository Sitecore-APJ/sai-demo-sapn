'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseRelatedQuestionsSettings } from '@/lib/search/parseSearchParams';
import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import RelatedQuestionsWidget from '@/components/non-sitecore/search/qa/related-questions-widget';
import { RELATED_QUESTIONS_WIDGET_ID } from '@/constants/search';

export const Default = (props: ComponentProps) => {
  const isAuthoring = useSearchAuthoring();
  const containerStyles = props.params?.Styles ? props.params.Styles : '';
  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const searchSettings = parseRelatedQuestionsSettings(props.params);
  const rfkId = searchSettings.SearchWidgetId || RELATED_QUESTIONS_WIDGET_ID;

  if (isAuthoring) {
    return (
      <div className={`component related-questions-default ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Related Questions" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component related-questions-default ${styles}`} id={id || undefined}>
      <div className="component-content">
        <RelatedQuestionsWidget settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
};
