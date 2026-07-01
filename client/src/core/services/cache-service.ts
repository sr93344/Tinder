import { HttpEvent } from '@angular/common/http';
import { Service } from '@angular/core';

@Service()
export class CacheService {
  private cacheMap = new Map<string, HttpEvent<unknown>>();

  set(url: string, value: any) {
    this.cacheMap.set(url, value);
  }

  delete(url: string) {
    this.cacheMap.delete(url);
  }

  get(url: string) {
    return this.cacheMap.get(url);
  }

  clearAll() {
    this.cacheMap.clear();
  }
}
