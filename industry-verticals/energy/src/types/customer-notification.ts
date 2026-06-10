import { Field, RichTextField } from '@sitecore-content-sdk/nextjs';
import { SitecoreItem } from './common';
import { IGQLTextField } from './igql';

export type OutageStatus = 'active' | 'planned' | 'restored';

export interface OutagePin {
  id: string;
  title: string;
  location: string;
  status: OutageStatus;
  date: string;
  lat: number;
  lng: number;
}

export interface OutageMapData {
  center: { lat: number; lng: number };
  zoom: number;
  outages: OutagePin[];
}

export interface ParseOutageMapResult {
  data: OutageMapData | null;
  errors: string[];
}

export interface CustomerNotificationPageFields {
  Title: Field<string>;
  OutageLocation: Field<string>;
  OutageDate: Field<string>;
  OutageSummary: Field<string>;
  OutageDescription: RichTextField;
  OutageLocationPinOnMap: Field<string>;
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
