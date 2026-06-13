'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseSearchSettings } from '@/lib/search/parseSearchParams';
import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import ContentTilesWidget from '@/components/non-sitecore/search/preview/content-tiles-widget';
import ContentListWidget from '@/components/non-sitecore/search/preview/content-list-widget';
import { CONTENT_LIST_WIDGET_ID, CONTENT_PREVIEW_WIDGET_ID } from '@/constants/search';

function getRenderingStyles(params: ComponentProps['params']) {
  const containerStyles = params?.Styles ? params.Styles : '';
  return `${params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
}

function ContentPreviewTiles(props: ComponentProps) {
  const isAuthoring = useSearchAuthoring();
  const styles = getRenderingStyles(props.params);
  const id = props.params.RenderingIdentifier;
  const searchSettings = parseSearchSettings(props.params);
  const rfkId = searchSettings.SearchWidgetId || CONTENT_PREVIEW_WIDGET_ID;

  if (isAuthoring) {
    return (
      <div className={`component content-preview-default ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Content Preview (Tiles)" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component content-preview-default ${styles}`} id={id || undefined}>
      <div className="component-content">
        <ContentTilesWidget settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
}

function ContentPreviewList(props: ComponentProps) {
  const isAuthoring = useSearchAuthoring();
  const styles = getRenderingStyles(props.params);
  const id = props.params.RenderingIdentifier;
  const searchSettings = parseSearchSettings(props.params);
  const rfkId = searchSettings.SearchWidgetId || CONTENT_LIST_WIDGET_ID;

  if (isAuthoring) {
    return (
      <div className={`component content-preview-list ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Content Preview (List)" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component content-preview-list ${styles}`} id={id || undefined}>
      <div className="component-content">
        <ContentListWidget settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
}

export const Default = (props: ComponentProps) => <ContentPreviewTiles {...props} />;
export const List = (props: ComponentProps) => <ContentPreviewList {...props} />;
