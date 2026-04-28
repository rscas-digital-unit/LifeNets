import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from '../services/cache-service';


export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Applichiamo la cache solo alle chiamate GET
  if (req.method !== 'GET') {
    return next(req);
  }

  // 2. Tipizzazione esplicita del servizio iniettato
  const cache: CacheService = inject(CacheService);
  
  const cachedData = cache.get(req.urlWithParams);

  if (cachedData) {
    // Se i dati esistono, restituiamo una nuova risposta HTTP con il corpo salvato
    return of(new HttpResponse({ 
      body: cachedData.body, 
      status: 200, 
      statusText: 'OK' 
    }));
  }

  // 3. Se non c'è in cache, proseguiamo la chiamata e salviamo il risultato
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.put(req.urlWithParams, event.body);
      }
    })
  );
};