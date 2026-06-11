import { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { SitecoreItem } from './common';
import { IGQLTextField } from './igql';

export type OutageStatus = 'Active' | 'Planned' | 'Restored' | 'Archived';

export interface CustomerNotificationPageFields {
  Title: Field<string>;
  Location: Field<string>;
  OutageDate: Field<string>;
  OutageSummary: Field<string>;
  OutageDescription: RichTextField;
  OutageStatus: Field<OutageStatus>;
  OutageMap: ImageField;
  Banner: Field<boolean>;
}

export type CustomerNotificationPage = SitecoreItem<CustomerNotificationPageFields>;

export type UpdateItemStatus = 'Active' | 'Resolved' | 'Cancelled';

/** Fields on the UpdateItemPage nested page template (template ID a6ebf6a6-8f90-1234-3456-e5f6a7b8c9d0). */
export interface UpdateItemFields {
  UpdateTitle: Field<string>;
  UpdateMessage: Field<string>;
  UpdateDateTime: Field<string>;
  UpdateStatus: Field<UpdateItemStatus>;
}

export type UpdateItem = SitecoreItem<UpdateItemFields>;

export interface UpdateItemGQL {
  id: string;
  updateTitle: IGQLTextField;
  updateMessage: IGQLTextField;
  updateDateTime: { jsonValue: Field<string> };
  updateStatus: IGQLTextField;
}

export interface NotificationBannerContextItemGQL {
  banner: { jsonValue: Field<boolean> };
  children: { results: UpdateItemGQL[] };
}

export interface NotificationBannerGQLFields {
  data: {
    contextItem?: NotificationBannerContextItemGQL;
  };
}

export interface BannerContent {
  title: string;
  message: string;
  status?: UpdateItemStatus;
  dateTime?: string;
}

export interface CustomerNotificationPageSummary {
  id: string;
  title: string;
  location?: string;
  outageDate?: string;
  outageSummary?: string;
  outageStatus?: OutageStatus;
  url?: string;
}

export interface CustomerNotificationPageGQL {
  id: string;
  name?: string;
  url?: { path: string };
  title: IGQLTextField;
  location: IGQLTextField;
  outageDate: { jsonValue: Field<string> };
  outageSummary: IGQLTextField;
  outageStatus: IGQLTextField;
}

export interface CustomerNotificationsOverviewGQLFields {
  data: {
    contextItem?: {
      children: { results: CustomerNotificationPageGQL[] };
    };
  };
}
