import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule
  ],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  currentLang = 'en';
  languages = ['en', 'es'];

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || this.currentLang;
  }

  useLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
