import { InjectionToken } from '@angular/core';

export interface ExternalConfig {
  Version: string;
  apiBaseUrl : string;
  authUrl : string;
  username: string;
  password: string;
  projectTagId: number;
  eventsLink: string;
  publicationsLink: string;
  postsLink: string;
  cacheTTLminutes: number;
}

export const APP_EXTERNAL_CONFIG = new InjectionToken<ExternalConfig>('AppExternalConfig');