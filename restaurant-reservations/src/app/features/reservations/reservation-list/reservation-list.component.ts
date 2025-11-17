import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Mesa, Reserva } from '../../../models';
import { MesasService, ReservasService, RestaurantService, ZonesService } from '../../../services';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  reservas: Reserva[] = [];
  displayedColumns: string[] = ['fecha', 'hora', 'cliente', 'personas', 'restaurante', 'zona', 'mesa', 'status', 'actions'];
  restaurantNames: Record<string, string> = {};
  zonaNames: Record<string, string> = {};
  mesaMap: Record<string, Mesa> = {};

  constructor(
    private reservasService: ReservasService,
    private restaurantService: RestaurantService,
    private zonesService: ZonesService,
    private mesasService: MesasService
  ) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.loadReferenceData();
    this.reservas = this.reservasService.getAll();
  }

  private loadReferenceData(): void {
    this.restaurantNames = this.restaurantService.getAll().reduce((acc, restaurant) => {
      acc[restaurant.id] = restaurant.nombre;
      return acc;
    }, {} as Record<string, string>);

    this.zonaNames = this.zonesService.getAll().reduce((acc, zona) => {
      acc[zona.id] = zona.nombre;
      return acc;
    }, {} as Record<string, string>);

    this.mesaMap = this.mesasService.getAll().reduce((acc, mesa) => {
      acc[mesa.id] = mesa;
      return acc;
    }, {} as Record<string, Mesa>);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'CONFIRMADA': return 'badge-success';
      case 'CANCELADA': return 'badge-error';
      case 'COMPLETADA': return 'badge-info';
      default: return 'badge-warning';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'CONFIRMADA': return 'event_available';
      case 'CANCELADA': return 'event_busy';
      case 'COMPLETADA': return 'check_circle';
      default: return 'help_outline';
    }
  }

  getHoraSalida(reserva: Reserva): string {
    if (reserva.horaFin && reserva.horaFin.trim() !== '') {
      return reserva.horaFin;
    }
    return this.addMinutesToHora(reserva.hora, 60);
  }

  private addMinutesToHora(hora: string, minutes: number): string {
    const [hours, mins] = hora.split(':').map(part => parseInt(part, 10));
    const safeHours = isNaN(hours) ? 0 : hours;
    const safeMinutes = isNaN(mins) ? 0 : mins;
    const totalMinutes = safeHours * 60 + safeMinutes + minutes;
    const minutesInDay = 24 * 60;
    const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
    const resultHours = Math.floor(normalized / 60);
    const resultMinutes = normalized % 60;
    return `${String(resultHours).padStart(2, '0')}:${String(resultMinutes).padStart(2, '0')}`;
  }

  cancelReservation(id: string): void {
    this.reservasService.cancel(id);
    this.loadReservas();
  }

  completeReservation(id: string): void {
    this.reservasService.complete(id);
    this.loadReservas();
  }
}
