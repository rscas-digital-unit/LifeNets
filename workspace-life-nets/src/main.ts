
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { APP_EXTERNAL_CONFIG } from './app/app.config.token';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

//bootstrapApplication(AppComponent, appConfig)
//  .catch(err => console.error(err));


async function startApp() {
  try {
    // 1. Carichiamo il file di configurazione esterno (deve stare in src/assets o essere un URL valido)
    const response = await fetch('/assets/config.json');
    const config = await response.json();

  
await bootstrapApplication(AppComponent, {
      providers: [
        provideHttpClient(),
        provideRouter(routes),
        // Registriamo il token con i dati caricati dal JSON
        { provide: APP_EXTERNAL_CONFIG, useValue: config }
      ]
    });
    //console.log(`App avviata con versione: ${config.Version}`);

  } catch (err) {
    // Fallback in caso il file config.json non venga trovato o sia corrotto
    console.error('Errore nel caricamento del config esterno, avvio con default', err);
    await bootstrapApplication(AppComponent, {
      providers: [
        provideHttpClient(),
        provideRouter(routes),
      ]
    });
   
  }
}

// Eseguiamo la funzione di avvio
startApp();