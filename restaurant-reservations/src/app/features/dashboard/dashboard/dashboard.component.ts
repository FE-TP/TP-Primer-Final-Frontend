import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RestaurantService, ZonesService, MesasService, ReservasService } from '../../../services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterLink, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalRestaurants: number = 0;
  totalZonas: number = 0;
  totalMesas: number = 0;
  totalReservas: number = 0;
  reservasHoy: number = 0;

  constructor(
    private restaurantService: RestaurantService,
    private zonesService: ZonesService,
    private mesasService: MesasService,
    private reservasService: ReservasService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.totalRestaurants = this.restaurantService.getActive().length;
    this.totalZonas = this.zonesService.getActive().length;
    this.totalMesas = this.mesasService.getActive().length;
    
    const allReservas = this.reservasService.getAll();
    this.totalReservas = allReservas.filter(r => r.status === 'CONFIRMADA').length;
    
    const today = this.formatDate(new Date());
    this.reservasHoy = allReservas.filter(r => 
      r.fecha === today && r.status === 'CONFIRMADA'
    ).length;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
