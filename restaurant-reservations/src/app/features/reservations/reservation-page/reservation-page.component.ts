import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Restaurant, Zona, Mesa } from '../../../models';
import { RestaurantService, ZonesService, MesasService, ReservasService } from '../../../services';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css'
})
export class ReservationPageComponent implements OnInit {
  reservationForm: FormGroup;
  restaurants: Restaurant[] = [];
  zonas: Zona[] = [];
  availableHorarios: string[] = [];
  maxCapacity: number = 0;
  assignedMesa: Mesa | null = null;
  searchPerformed: boolean = false;
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private zonesService: ZonesService,
    private mesasService: MesasService,
    private reservasService: ReservasService,
    private snackBar: MatSnackBar
  ) {
    this.reservationForm = this.fb.group({
      restauranteId: ['', Validators.required],
      zonaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      cantidadPersonas: [1, [Validators.required, Validators.min(1)]],
      nombreCliente: ['', Validators.required],
      apellidoCliente: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadRestaurants();
    this.setupFormListeners();
  }

  loadRestaurants(): void {
    this.restaurants = this.restaurantService.getActive();
  }

  setupFormListeners(): void {
    // Listener para restaurante
    this.reservationForm.get('restauranteId')?.valueChanges.subscribe(restauranteId => {
      this.onRestaurantChange(restauranteId);
    });

    // Listener para zona
    this.reservationForm.get('zonaId')?.valueChanges.subscribe(zonaId => {
      this.onZonaChange(zonaId);
    });

    // Listener para fecha
    this.reservationForm.get('fecha')?.valueChanges.subscribe(() => {
      this.resetMesaSearch();
    });

    // Listener para hora
    this.reservationForm.get('hora')?.valueChanges.subscribe(() => {
      this.resetMesaSearch();
    });

    // Listener para cantidad de personas
    this.reservationForm.get('cantidadPersonas')?.valueChanges.subscribe(() => {
      this.resetMesaSearch();
    });
  }

  onRestaurantChange(restauranteId: string): void {
    this.zonas = this.zonesService.getByRestaurant(restauranteId);
    this.reservationForm.patchValue({
      zonaId: '',
      hora: ''
    });
    this.availableHorarios = [];
    this.maxCapacity = 0;
    this.resetMesaSearch();
  }

  onZonaChange(zonaId: string): void {
    const zona = this.zonesService.getById(zonaId);
    if (zona) {
      // Verificar si la zona tiene mesas activas
      const mesasEnZona = this.mesasService.getByZona(zonaId).filter(m => m.activo);
      
      if (mesasEnZona.length === 0) {
        this.snackBar.open(
          'Esta zona no tiene mesas disponibles. Por favor selecciona otra zona.',
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
        this.reservationForm.patchValue({ zonaId: '' });
        this.availableHorarios = [];
        this.maxCapacity = 0;
        this.resetMesaSearch();
        return;
      }
      
      this.availableHorarios = zona.horariosDisponibles;
      this.maxCapacity = this.mesasService.getMaxCapacityByZona(zonaId);
      
      // Actualizar validación de cantidad de personas
      this.reservationForm.get('cantidadPersonas')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxCapacity)
      ]);
      this.reservationForm.get('cantidadPersonas')?.updateValueAndValidity();
    }
    this.reservationForm.patchValue({ hora: '' });
    this.resetMesaSearch();
  }

  getFilteredHorarios(): string[] {
    const fecha = this.reservationForm.get('fecha')?.value;
    if (!fecha) return this.availableHorarios;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(fecha);
    selectedDate.setHours(0, 0, 0, 0);

    // Si la fecha seleccionada es hoy, filtrar horarios pasados
    if (selectedDate.getTime() === today.getTime()) {
      const currentHour = new Date().getHours();
      return this.availableHorarios.filter(horario => {
        const [hours] = horario.split(':').map(Number);
        return hours > currentHour;
      });
    }

    return this.availableHorarios;
  }

  incrementPersonas(): void {
    const current = this.reservationForm.get('cantidadPersonas')?.value || 0;
    if (current < this.maxCapacity) {
      this.reservationForm.patchValue({ cantidadPersonas: current + 1 });
    }
  }

  decrementPersonas(): void {
    const current = this.reservationForm.get('cantidadPersonas')?.value || 0;
    if (current > 1) {
      this.reservationForm.patchValue({ cantidadPersonas: current - 1 });
    }
  }

  resetMesaSearch(): void {
    this.assignedMesa = null;
    this.searchPerformed = false;
  }

  searchAvailableTable(): void {
    if (!this.isSearchFormValid()) {
      this.snackBar.open('Por favor completa los campos de búsqueda', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const zonaId = this.reservationForm.get('zonaId')?.value;
    const fecha = this.formatDate(this.reservationForm.get('fecha')?.value);
    const hora = this.reservationForm.get('hora')?.value;
    const cantidadPersonas = this.reservationForm.get('cantidadPersonas')?.value;

    this.assignedMesa = this.reservasService.findAvailableTable(
      zonaId,
      fecha,
      hora,
      cantidadPersonas
    );

    this.searchPerformed = true;

    if (!this.assignedMesa) {
      this.snackBar.open(
        'No hay mesas disponibles para esta combinación de fecha/hora/personas.',
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['error-snackbar']
        }
      );
    }
  }

  isSearchFormValid(): boolean {
    return !!(
      this.reservationForm.get('restauranteId')?.value &&
      this.reservationForm.get('zonaId')?.value &&
      this.reservationForm.get('fecha')?.value &&
      this.reservationForm.get('hora')?.value &&
      this.reservationForm.get('cantidadPersonas')?.valid
    );
  }

  canConfirmReservation(): boolean {
    return this.reservationForm.valid && this.assignedMesa !== null;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  confirmReservation(): void {
    if (!this.canConfirmReservation() || !this.assignedMesa) {
      this.snackBar.open(
        'No se puede confirmar la reserva sin una mesa asignada.',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['error-snackbar']
        }
      );
      return;
    }

    const formValue = this.reservationForm.value;
    const reserva = this.reservasService.create({
      restauranteId: formValue.restauranteId,
      zonaId: formValue.zonaId,
      fecha: this.formatDate(formValue.fecha),
      hora: formValue.hora,
      cantidadPersonas: formValue.cantidadPersonas,
      nombreCliente: formValue.nombreCliente,
      apellidoCliente: formValue.apellidoCliente,
      telefono: formValue.telefono,
      mesaId: this.assignedMesa.id
    });

    if (reserva) {
      this.snackBar.open(
        `Reserva confirmada. Mesa asignada: ${this.assignedMesa.numero}`,
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['success-snackbar']
        }
      );
      this.resetForm();
    } else {
      this.snackBar.open(
        'Error al confirmar la reserva. Intenta nuevamente.',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['error-snackbar']
        }
      );
    }
  }

  resetForm(): void {
    this.reservationForm.reset({
      cantidadPersonas: 1
    });
    this.zonas = [];
    this.availableHorarios = [];
    this.maxCapacity = 0;
    this.assignedMesa = null;
    this.searchPerformed = false;
  }

  getRestaurantName(id: string): string {
    return this.restaurants.find(r => r.id === id)?.nombre || '';
  }

  getZonaName(id: string): string {
    return this.zonas.find(z => z.id === id)?.nombre || '';
  }
}
