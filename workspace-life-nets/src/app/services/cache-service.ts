import { inject, Injectable } from '@angular/core';
import { APP_EXTERNAL_CONFIG } from '../app.config.token';

@Injectable({ providedIn: 'root' })
export class CacheService {
  config = inject(APP_EXTERNAL_CONFIG);
  private readonly TTL = this.config.cacheTTLminutes * 60 * 1000; 

  put(key: string, body: any): void {
    const data = {
      body,
      expiry: Date.now() + this.TTL
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key: string): any | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const data = JSON.parse(raw);

    if (Date.now() > data.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  }
}