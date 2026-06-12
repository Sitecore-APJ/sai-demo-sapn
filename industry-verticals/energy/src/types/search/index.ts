export interface ISearchSettings {
  NumberOfItems: number;
  SearchWidgetId: string;
  DisplayImage: boolean;
  DisplayContentType: boolean;
  DisplayAddToFavourites: boolean;
  DisplayRatings: boolean;
  Title: string;
  DisplayTitle: boolean;
}

export interface ISearchResultSettings extends ISearchSettings {
  CTAButtonText: string;
  DefaultView: string;
  NumberOfColumns: number;
  DisplayViewToggle: boolean;
  DisplayHeader: boolean;
  KeywordSearch: boolean;
  DefaultKeyword?: string;
  UsePageContext: boolean;
  AllowFilters: boolean;
}

export interface IQuestionAnswerSettings {
  SearchWidgetId: string;
  DefaultQuestion: string;
}

export interface IRelatedQuestionsSettings {
  SearchWidgetId: string;
  DefaultQuestion: string;
  NumberOfItems: number;
  Title: string;
  DisplayTitle: boolean;
}

export interface IRecommendationSettings {
  NumberOfItems: number;
  SearchWidgetId: string;
  Title: string;
  DisplayTitle: boolean;
}

export interface ISuggestionSettings {
  NumberOfItems: number;
  SearchWidgetId: string;
  SuggestionAttribute: string;
  DisplayFrequency: boolean;
  Title: string;
  DisplayTitle: boolean;
}

export type ContentModel = {
  id: string;
  name: string;
  url?: string;
  image_url?: string;
  source_id?: string;
  type?: string;
  review_rating?: number;
  description?: string;
  title?: string;
};

export type QuestionAnswerModel = {
  id: string;
  question: string;
  answer: string;
  type: string;
};
