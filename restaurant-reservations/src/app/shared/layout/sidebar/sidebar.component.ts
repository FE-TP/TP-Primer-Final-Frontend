import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  emoji: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', emoji: '📊' },
    { label: 'Nueva Reserva', icon: 'add_circle', route: '/reservations/new', emoji: '➕' },
    { label: 'Reservas', icon: 'event', route: '/reservations', emoji: '📅' },
    { label: 'Restaurantes', icon: 'restaurant', route: '/restaurants', emoji: '🍽️' },
    { label: 'Zonas', icon: 'map', route: '/zones', emoji: '🗺️' },
    { label: 'Mesas', icon: 'table_bar', route: '/mesas', emoji: '🪑' }
  ];
}
