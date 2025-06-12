import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'BikeShare-frontend';
  constructor(private translate: TranslateService) {
    translate.addLangs(['es','en']);
    translate.setDefaultLang('es');
    translate.use('es');
  }
}
