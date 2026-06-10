import { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { SitecoreItem } from './common';
import { IGQLTextField } from './igql';

export type OutageStatus = 'Active' | 'Planned' | 'Restored';

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

export interface NotificationBannerDatasourceGQL {
  banner: { jsonValue: Field<boolean> };
  children: { results: UpdateItemGQL[] };
}

export interface NotificationBannerGQLFields {
  data: {
    datasource?: NotificationBannerDatasourceGQL;
    contextItem?: NotificationBannerDatasourceGQL;
  };
}

export interface BannerContent {
  title: string;
  message: string;
  status?: UpdateItemStatus;
  dateTime?: string;
}
