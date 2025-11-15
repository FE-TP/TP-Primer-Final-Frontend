import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Reserva } from '../../../models';
import { ReservasService } from '../../../services';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  reservas: Reserva[] = [];
  displayedColumns: string[] = ['fecha', 'hora', 'cliente', 'personas', 'restaurante', 'status', 'actions'];

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.reservas = this.reservasService.getAll();
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

  cancelReservation(id: string): void {
    this.reservasService.cancel(id);
    this.loadReservas();
  }

  completeReservation(id: string): void {
    this.reservasService.complete(id);
    this.loadReservas();
  }
}
