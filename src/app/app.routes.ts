import { Routes } from '@angular/router';

const LoginPage = () =>
  import('./public/pages/login/login.page').then(m => m.LoginPage);
const RegisterPage = () =>
  import('./public/pages/register/register.page').then(m => m.RegisterPage);

const OwnerLayoutComponent = () =>
  import('./owner/components/owner-layout/owner-layout.component').then(m => m.OwnerLayoutComponent);
const RenterLayoutComponent = () =>
  import('./renter/components/renter-layout/renter-layout.component').then(m => m.RenterLayoutComponent);

const OwnerHomePage = () =>
  import('./owner/pages/home/owner-home.page').then(m => m.OwnerHomePage);
const RenterHomePage = () =>
  import('./renter/pages/home/renter-home.page').then(m => m.RenterHomePage);
const RenterMapPage = () =>
  import('./renter/pages/map/map.page').then(m => m.MapPage);
const RenterProfilePage = () =>
  import('./renter/pages/profile/profile.page').then(m => m.ProfilePage);
const RenterSupportPage = () =>
  import('./renter/pages/support/support.page').then(m => m.SupportPage);

export const routes: Routes = [
  {
    path: 'owner',
    loadComponent: OwnerLayoutComponent,
    children: [
      { path: 'home', loadComponent: OwnerHomePage },
      { path: '',     redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'renter',
    loadComponent: RenterLayoutComponent,
    children: [
      { path: 'home',    loadComponent: RenterHomePage   },
      { path: 'map',     loadComponent: RenterMapPage    },
      { path: 'profile', loadComponent: RenterProfilePage },
      { path: 'support', loadComponent: RenterSupportPage },
      { path: '',        redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'login',    loadComponent: LoginPage },
  { path: 'register', loadComponent: RegisterPage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
