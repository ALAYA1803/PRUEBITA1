import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-home',
  standalone: true,
  template: `
    <div class="home-wrapper">
      <h1>{{ 'OwnerHome.Title' | translate }}</h1>
      <p>{{ 'OwnerHome.Subtitle' | translate }}</p>
    </div>
  `,
  styles: [`
    .home-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      font-family: Arial, sans-serif;
    }
  `]
})
export class OwnerHomePage {}
