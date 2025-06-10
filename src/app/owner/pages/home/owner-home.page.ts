import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-home',
  standalone: true,
  template: `
    <div class="home-wrapper">
      <h1>Welcome, Owner!</h1>
      <p>This is the owner dashboard.</p>
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
