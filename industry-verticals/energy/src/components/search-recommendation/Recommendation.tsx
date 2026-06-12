'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseRecommendationSettings } from '@/lib/search/parseSearchParams';
import RecommendationWidget from '@/components/non-sitecore/search/recommendation/recommendation-widget';
import { RECOMMENDATION_WIDGET_ID } from '@/constants/search';

export const Default = (props: ComponentProps) => {
  const containerStyles = props.params?.Styles ? props.params.Styles : '';
  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const searchSettings = parseRecommendationSettings(props.params);
  const rfkId = searchSettings.SearchWidgetId || RECOMMENDATION_WIDGET_ID;

  return (
    <div className={`component recommendation-default ${styles}`} id={id || undefined}>
      <div className="component-content">
        <RecommendationWidget settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
};
