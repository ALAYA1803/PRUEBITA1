import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }        from '@angular/router';
import { AppComponent }         from './app/app.component';
import { routes }               from './app/app.routes';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations }    from '@angular/platform-browser/animations';
import { importProvidersFrom }  from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient }           from '@angular/common/http';
import { TranslateHttpLoader }  from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
}).catch(err => console.error(err));
