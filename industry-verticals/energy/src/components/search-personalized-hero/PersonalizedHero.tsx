'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseRecommendationSettings } from '@/lib/search/parseSearchParams';
import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import PersonalizedHeroWidget from '@/components/non-sitecore/search/recommendation/personalized-hero-widget';
import { PERSONALIZED_HERO_WIDGET_ID } from '@/constants/search';

export const Default = (props: ComponentProps) => {
  const isAuthoring = useSearchAuthoring();
  const containerStyles = props.params?.Styles ? props.params.Styles : '';
  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const searchSettings = {
    ...parseRecommendationSettings(props.params),
    NumberOfItems: 1,
  };
  const rfkId = searchSettings.SearchWidgetId || PERSONALIZED_HERO_WIDGET_ID;

  if (isAuthoring) {
    return (
      <div className={`component personalized-hero-default ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Personalized Hero" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component personalized-hero-default ${styles}`} id={id || undefined}>
      <div className="component-content">
        <PersonalizedHeroWidget params={props.params} settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
};
