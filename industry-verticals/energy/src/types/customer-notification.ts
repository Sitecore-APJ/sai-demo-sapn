import { Field } from '@sitecore-content-sdk/nextjs';
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
  OutageMap: Field<string>;
  Banner: Field<string>;
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

export interface CustomerNotificationDatasourceGQL {
  title: IGQLTextField;
  outageLocation: IGQLTextField;
  outageDate: { jsonValue: Field<string> };
  outageMap: IGQLTextField;
  banner: IGQLTextField;
  children: { results: UpdateItemGQL[] };
}

export interface CustomerNotificationGQLFields {
  data: {
    datasource: CustomerNotificationDatasourceGQL;
  };
}

export interface BannerContent {
  source: 'update' | 'fallback';
  title: string;
  message: string;
  status?: UpdateItemStatus;
  dateTime?: string;
}
