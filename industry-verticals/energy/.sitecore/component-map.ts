// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as Title from 'src/components/title/Title';
import * as ThemeEditor from 'src/components/theme-editor/ThemeEditor';
import * as Tabs from 'src/components/tabs/Tabs';
import * as Steps from 'src/components/steps/Steps';
import * as SocialFollow from 'src/components/social-follow/SocialFollow';
import * as SelectedArticles from 'src/components/selected-articles/SelectedArticles';
import * as SectionWrapper from 'src/components/section-wrapper/SectionWrapper';
import * as Suggestions from 'src/components/search-suggestions/Suggestions';
import * as SearchResults from 'src/components/search-results/SearchResults';
import * as RelatedQuestions from 'src/components/search-related-questions/RelatedQuestions';
import * as Recommendation from 'src/components/search-recommendation/Recommendation';
import * as QuestionAndAnswer from 'src/components/search-qa/QuestionAndAnswer';
import * as PersonalizedHero from 'src/components/search-personalized-hero/PersonalizedHero';
import * as ContentResults from 'src/components/search-content-results/ContentResults';
import * as ContentPreview from 'src/components/search-content-preview/ContentPreview';
import * as ContentList from 'src/components/search-content-list/ContentList';
import * as SearchBar from 'src/components/search-bar/SearchBar';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as RichText from 'src/components/rich-text/RichText';
import * as Promo from 'src/components/promo/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/page-content/PageContent';
import * as Navigation from 'src/components/navigation/Navigation';
import * as LinkList from 'src/components/link-list/LinkList';
import * as Image from 'src/components/image/Image';
import * as HeroBanner from 'src/components/hero-banner/HeroBanner';
import * as Header from 'src/components/header/Header';
import * as GridStatusGauge from 'src/components/gridstatusgauge/GridStatusGauge';
import * as GridDemand from 'src/components/grid-demand/GridDemand';
import * as gridChartData from 'src/components/grid-demand/gridChartData';
import * as gridData from 'src/components/grid-conditions/gridData';
import * as GridConditions from 'src/components/grid-conditions/GridConditions';
import * as Footer from 'src/components/footer/Footer';
import * as Features from 'src/components/features/Features';
import * as NotificationList from 'src/components/customer-notification/NotificationList';
import * as NotificationBanner from 'src/components/customer-notification/NotificationBanner';
import * as CustomerNotificationsOverview from 'src/components/customer-notification/CustomerNotificationsOverview';
import * as CustomerNotification from 'src/components/customer-notification/CustomerNotification';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';
import * as Carousel from 'src/components/carousel/Carousel';
import * as ArticleListing from 'src/components/article-listing/ArticleListing';
import * as ArticleDetails from 'src/components/article-details/ArticleDetails';
import * as Accordion from 'src/components/accordion/Accordion';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Title', { ...Title }],
  ['ThemeEditor', { ...ThemeEditor }],
  ['Tabs', { ...Tabs, componentType: 'client' }],
  ['Steps', { ...Steps, componentType: 'client' }],
  ['SocialFollow', { ...SocialFollow }],
  ['SelectedArticles', { ...SelectedArticles }],
  ['SectionWrapper', { ...SectionWrapper }],
  ['Suggestions', { ...Suggestions, componentType: 'client' }],
  ['SearchResults', { ...SearchResults }],
  ['RelatedQuestions', { ...RelatedQuestions, componentType: 'client' }],
  ['Recommendation', { ...Recommendation, componentType: 'client' }],
  ['QuestionAndAnswer', { ...QuestionAndAnswer, componentType: 'client' }],
  ['PersonalizedHero', { ...PersonalizedHero, componentType: 'client' }],
  ['ContentResults', { ...ContentResults, componentType: 'client' }],
  ['ContentPreview', { ...ContentPreview, componentType: 'client' }],
  ['ContentList', { ...ContentList, componentType: 'client' }],
  ['SearchBar', { ...SearchBar, componentType: 'client' }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList }],
  ['Image', { ...Image }],
  ['HeroBanner', { ...HeroBanner }],
  ['Header', { ...Header, componentType: 'client' }],
  ['GridStatusGauge', { ...GridStatusGauge }],
  ['GridDemand', { ...GridDemand }],
  ['gridChartData', { ...gridChartData }],
  ['gridData', { ...gridData }],
  ['GridConditions', { ...GridConditions }],
  ['Footer', { ...Footer }],
  ['Features', { ...Features, componentType: 'client' }],
  ['NotificationList', { ...NotificationList }],
  ['NotificationBanner', { ...NotificationBanner, componentType: 'client' }],
  ['CustomerNotificationsOverview', { ...CustomerNotificationsOverview, componentType: 'client' }],
  ['CustomerNotification', { ...CustomerNotification, componentType: 'client' }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['Carousel', { ...Carousel, componentType: 'client' }],
  ['ArticleListing', { ...ArticleListing }],
  ['ArticleDetails', { ...ArticleDetails }],
  ['Accordion', { ...Accordion, componentType: 'client' }],
]);

export default componentMap;
