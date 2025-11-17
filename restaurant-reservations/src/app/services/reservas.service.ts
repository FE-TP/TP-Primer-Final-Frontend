import { Injectable } from '@angular/core';
import { Reserva, ReservaStatus, Mesa } from '../models';
import { StorageService } from './storage.service';
import { MesasService } from './mesas.service';
import { v4 as uuidv4 } from 'uuid';

export interface ReservaFilters {
  restauranteId?: string;
  zonaId?: string;
  fecha?: string;
  status?: ReservaStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private readonly STORAGE_KEY = 'reservas';

  constructor(
    private storage: StorageService,
    private mesasService: MesasService
  ) {
    this.initializeData();
  }

  private initializeData(): void {
    const existing = this.getAll();
    if (existing.length === 0) {
      const mesas = this.storage.get<any[]>('mesas') || [];
      const zonas = this.storage.get<any[]>('zonas') || [];
      const restaurants = this.storage.get<any[]>('restaurants') || [];
      
      if (mesas.length >= 3 && zonas.length >= 3 && restaurants.length >= 3) {
        // Obtener fechas para las reservas de prueba
        const hoy = new Date();
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);
        const pasadoManana = new Date(hoy);
        pasadoManana.setDate(pasadoManana.getDate() + 2);
        
        const formatDate = (date: Date): string => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const initialReservas: Reserva[] = [
          // Reserva 1 - La Terraza - Terraza Exterior
          {
            id: uuidv4(),
            fecha: formatDate(hoy),
            hora: '20:00',
            horaFin: '22:00',
            cantidadPersonas: 4,
            mesaId: mesas[1]?.id || mesas[0].id, // Mesa T2 (capacidad 4)
            nombreCliente: 'Juan',
            apellidoCliente: 'Pérez',
            telefono: '0981234567',
            restauranteId: restaurants[0].id,
            zonaId: zonas[0].id,
            status: 'CONFIRMADA'
          },
          // Reserva 2 - El Jardín - Jardín de Invierno
          {
            id: uuidv4(),
            fecha: formatDate(manana),
            hora: '13:00',
            horaFin: '15:00',
            cantidadPersonas: 2,
            mesaId: mesas[9]?.id || mesas[0].id, // Mesa J1 (capacidad 2)
            nombreCliente: 'María',
            apellidoCliente: 'González',
            telefono: '0982345678',
            restauranteId: restaurants[1].id,
            zonaId: zonas[3].id,
            status: 'CONFIRMADA'
          },
          // Reserva 3 - Parrilla Don José - Salón de Parrilla
          {
            id: uuidv4(),
            fecha: formatDate(pasadoManana),
            hora: '21:00',
            horaFin: '23:00',
            cantidadPersonas: 6,
            mesaId: mesas[19]?.id || mesas[0].id, // Mesa PA2 (capacidad 6)
            nombreCliente: 'Carlos',
            apellidoCliente: 'Rodríguez',
            telefono: '0983456789',
            restauranteId: restaurants[2].id,
            zonaId: zonas[6].id,
            status: 'CONFIRMADA'
          }
        ];
        
        this.storage.set(this.STORAGE_KEY, initialReservas);
      }
    }
  }

  private parseHoraToMinutes(hora: string): number {
    const [hours, minutes] = hora.split(':').map(part => parseInt(part, 10));
    const safeHours = isNaN(hours) ? 0 : hours;
    const safeMinutes = isNaN(minutes) ? 0 : minutes;
    return safeHours * 60 + safeMinutes;
  }

  private formatMinutesToHora(totalMinutes: number): string {
    const minutesInDay = 24 * 60;
    const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private getReservaHoraFin(reserva: Reserva): string {
    if (reserva.horaFin && reserva.horaFin.trim() !== '') {
      return reserva.horaFin;
    }
    return this.formatMinutesToHora(this.parseHoraToMinutes(reserva.hora) + 60);
  }

  private hasTimeOverlap(reserva: Reserva, startMinutes: number, endMinutes: number): boolean {
    const reservaStart = this.parseHoraToMinutes(reserva.hora);
    const reservaEnd = this.parseHoraToMinutes(this.getReservaHoraFin(reserva));
    return startMinutes < reservaEnd && endMinutes > reservaStart;
  }

  getAll(): Reserva[] {
    return this.storage.get<Reserva[]>(this.STORAGE_KEY) || [];
  }

  getById(id: string): Reserva | undefined {
    return this.getAll().find(r => r.id === id);
  }

  getByFilters(filters: ReservaFilters): Reserva[] {
    let reservas = this.getAll();

    if (filters.restauranteId) {
      reservas = reservas.filter(r => r.restauranteId === filters.restauranteId);
    }

    if (filters.zonaId) {
      reservas = reservas.filter(r => r.zonaId === filters.zonaId);
    }

    if (filters.fecha) {
      reservas = reservas.filter(r => r.fecha === filters.fecha);
    }

    if (filters.status) {
      reservas = reservas.filter(r => r.status === filters.status);
    }

    return reservas;
  }

  getActiveReservations(): Reserva[] {
    return this.getAll().filter(r => r.status === 'CONFIRMADA');
  }

  findAvailableTable(
    zonaId: string,
    fecha: string,
    horaInicio: string,
    horaFin: string,
    cantidadPersonas: number
  ): Mesa | null {
    // Obtener todas las mesas activas de la zona
    const mesasActivas = this.mesasService.getByZona(zonaId);
    
    // Filtrar mesas con capacidad suficiente
    const mesasValidas = mesasActivas.filter(m => m.capacidad >= cantidadPersonas);
    
    if (mesasValidas.length === 0) return null;

    if (!horaFin) return null;

    const startMinutes = this.parseHoraToMinutes(horaInicio);
    const endMinutes = this.parseHoraToMinutes(horaFin);

    if (endMinutes <= startMinutes) return null;

    // Obtener reservas confirmadas para esa fecha
    const reservasConfirmadas = this.getAll().filter(
      r => r.fecha === fecha && 
           r.status === 'CONFIRMADA'
    );

    // Filtrar mesas disponibles teniendo en cuenta todo el rango horario
    const mesasDisponibles = mesasValidas.filter(mesa => {
      return !reservasConfirmadas.some(reserva => {
        if (reserva.mesaId !== mesa.id) return false;
        return this.hasTimeOverlap(reserva, startMinutes, endMinutes);
      });
    });

    if (mesasDisponibles.length === 0) return null;

    // Ordenar por capacidad ascendente y devolver la más ajustada
    mesasDisponibles.sort((a, b) => a.capacidad - b.capacidad);
    
    return mesasDisponibles[0];
  }

  create(reserva: Omit<Reserva, 'id' | 'status'>): Reserva | null {
    if (!reserva.horaFin) return null;
    if (this.parseHoraToMinutes(reserva.horaFin) <= this.parseHoraToMinutes(reserva.hora)) return null;

    // Buscar mesa disponible
    const mesaDisponible = this.findAvailableTable(
      reserva.zonaId,
      reserva.fecha,
      reserva.hora,
      reserva.horaFin,
      reserva.cantidadPersonas
    );

    if (!mesaDisponible) return null;

    const reservas = this.getAll();
    const newReserva: Reserva = {
      ...reserva,
      id: uuidv4(),
      mesaId: mesaDisponible.id,
      status: 'CONFIRMADA'
    };

    reservas.push(newReserva);
    this.storage.set(this.STORAGE_KEY, reservas);
    return newReserva;
  }

  update(id: string, data: Partial<Reserva>): Reserva | null {
    const reservas = this.getAll();
    const index = reservas.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    reservas[index] = { ...reservas[index], ...data };
    this.storage.set(this.STORAGE_KEY, reservas);
    return reservas[index];
  }

  cancel(id: string): boolean {
    return this.update(id, { status: 'CANCELADA' }) !== null;
  }

  complete(id: string): boolean {
    return this.update(id, { status: 'COMPLETADA' }) !== null;
  }

  // Método para reasignar reservas cuando se elimina una mesa
  reassignReservations(mesaId: string): { reassigned: number; cancelled: number } {
    const reservasAfectadas = this.getAll().filter(
      r => r.mesaId === mesaId && r.status === 'CONFIRMADA'
    );

    let reassigned = 0;
    let cancelled = 0;

    reservasAfectadas.forEach(reserva => {
      const nuevaMesa = this.findAvailableTable(
        reserva.zonaId,
        reserva.fecha,
        reserva.hora,
        this.getReservaHoraFin(reserva),
        reserva.cantidadPersonas
      );

      if (nuevaMesa) {
        this.update(reserva.id, { mesaId: nuevaMesa.id });
        reassigned++;
      } else {
        this.cancel(reserva.id);
        cancelled++;
      }
    });

    return { reassigned, cancelled };
  }

  // Método para cancelar todas las reservas de una mesa
  cancelReservationsByMesa(mesaId: string): number {
    const reservasAfectadas = this.getAll().filter(
      r => r.mesaId === mesaId && r.status === 'CONFIRMADA'
    );

    reservasAfectadas.forEach(reserva => {
      this.cancel(reserva.id);
    });

    return reservasAfectadas.length;
  }
}
