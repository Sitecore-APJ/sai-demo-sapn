import type { ComponentParams } from '@sitecore-content-sdk/nextjs';
import { SUGGESTIONS_WIDGET_ID } from '@/constants/search';
import type {
  IRecommendationSettings,
  IRelatedQuestionsSettings,
  ISearchResultSettings,
  ISearchSettings,
  ISuggestionSettings,
  IQuestionAnswerSettings,
} from '@/types/search';

export function paramFlag(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value === '1';
}

export function paramInt(value: string | undefined, defaultValue = 0): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

export function parseSearchSettings(params: ComponentParams): ISearchSettings {
  return {
    NumberOfItems: paramInt(params.NumberOfItems as string, 6),
    SearchWidgetId: (params.SearchWidgetId as string) ?? '',
    DisplayImage: paramFlag(params.DisplayImage as string, true),
    DisplayContentType: paramFlag(params.DisplayContentType as string, true),
    DisplayAddToFavourites: paramFlag(params.DisplayAddToFavourites as string, false),
    DisplayRatings: paramFlag(params.DisplayRatings as string, false),
    DisplayTitle: paramFlag(params.DisplayTitle as string, false),
    Title: (params.Title as string) ?? '',
  };
}

export function parseSearchResultSettings(params: ComponentParams): ISearchResultSettings {
  return {
    ...parseSearchSettings(params),
    CTAButtonText: (params.CTAButtonText as string) ?? 'Explore More',
    DefaultView: paramFlag(params.DisplayInGrid as string) ? 'grid' : 'list',
    NumberOfColumns: paramInt(params.NumberOfColumns as string, 3),
    DisplayViewToggle: paramFlag(params.DisplayViewToggle as string, false),
    DisplayHeader: paramFlag(params.DisplayHeader as string, false),
    KeywordSearch: paramFlag(params.KeywordSearch as string, false),
    DefaultKeyword: params.DefaultKeyword as string | undefined,
    UsePageContext: paramFlag(params.UsePageContext as string, false),
    AllowFilters: paramFlag(params.AllowFilters as string, false),
  };
}

export function parseSuggestionSettings(
  params: ComponentParams,
  renderingParams?: ComponentParams
): ISuggestionSettings {
  // Prefer rendering.params — merged props.params can pick up values from the placeholder parent.
  const source = (renderingParams ?? params) as ComponentParams;

  return {
    NumberOfItems: paramInt(source.NumberOfItems as string, 6),
    SearchWidgetId: (source.SearchWidgetId as string) || SUGGESTIONS_WIDGET_ID,
    SuggestionAttribute: (source.SuggestionAttribute as string) || 'title_context_aware',
    DisplayFrequency: paramFlag(source.DisplayFrequency as string, false),
    DisplayTitle: paramFlag(source.DisplayTitle as string, false),
    Title: (source.Title as string) || 'Related Questions',
  };
}

export function parseQuestionAnswerSettings(params: ComponentParams): IQuestionAnswerSettings {
  return {
    SearchWidgetId: (params.SearchWidgetId as string) ?? '',
    DefaultQuestion: (params.DefaultQuestion as string) ?? '',
  };
}

export function parseRelatedQuestionsSettings(params: ComponentParams): IRelatedQuestionsSettings {
  return {
    SearchWidgetId: (params.SearchWidgetId as string) ?? '',
    DefaultQuestion: (params.DefaultQuestion as string) ?? '',
    NumberOfItems: paramInt(params.NumberOfItems as string, 3),
    DisplayTitle: paramFlag(params.DisplayTitle as string, false),
    Title: (params.Title as string) ?? '',
  };
}

export function parseRecommendationSettings(params: ComponentParams): IRecommendationSettings {
  return {
    NumberOfItems: paramInt(params.NumberOfItems as string, 4),
    SearchWidgetId: (params.SearchWidgetId as string) ?? '',
    DisplayTitle: paramFlag(params.DisplayTitle as string, false),
    Title: (params.Title as string) ?? '',
  };
}
