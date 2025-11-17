import { Routes } from '@angular/router';
import { ReservationPageComponent } from './features/reservations/reservation-page/reservation-page.component';
import { ReservationListComponent } from './features/reservations/reservation-list/reservation-list.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { RestaurantListComponent } from './features/restaurants/restaurant-list/restaurant-list.component';
import { ZoneListComponent } from './features/zones/zone-list/zone-list.component';
import { MesaListComponent } from './features/mesas/mesa-list/mesa-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reservations/new', component: ReservationPageComponent },
  { path: 'reservations', component: ReservationListComponent },
  { path: 'restaurants', component: RestaurantListComponent },
  { path: 'zones', component: ZoneListComponent },
  { path: 'mesas', component: MesaListComponent }
];
