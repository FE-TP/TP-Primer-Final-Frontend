import { Injectable } from '@angular/core';
import { Zona } from '../models';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  private readonly STORAGE_KEY = 'zonas';

  constructor(private storage: StorageService) {
    this.initializeData();
  }

  private horaStringToMinutes(hora: string): number {
    const [hours, minutes] = hora.split(':').map(part => parseInt(part, 10));
    const safeHours = isNaN(hours) ? 0 : hours;
    const safeMinutes = isNaN(minutes) ? 0 : minutes;
    return safeHours * 60 + safeMinutes;
  }

  private minutesToHoraString(totalMinutes: number): string {
    const minutesInDay = 24 * 60;
    const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private expandHorarios(horarios: string[]): string[] {
    if (!horarios || horarios.length === 0) return [];

    const sanitized = horarios
      .map(h => (h ?? '').trim())
      .filter(h => h.length > 0);

    const result: string[] = [];

    for (let i = 0; i < sanitized.length; i++) {
      const current = sanitized[i];
      if (!result.includes(current)) {
        result.push(current);
      }

      if (i < sanitized.length - 1) {
        const currentMinutes = this.horaStringToMinutes(current);
        const nextMinutes = this.horaStringToMinutes(sanitized[i + 1]);

        if (nextMinutes - currentMinutes > 60) {
          let slot = currentMinutes + 60;
          while (slot < nextMinutes) {
            const formatted = this.minutesToHoraString(slot);
            if (!result.includes(formatted)) {
              result.push(formatted);
            }
            slot += 60;
          }
        }
      }
    }

    return result;
  }

  private initializeData(): void {
    const existing = this.getAll();
    if (existing.length === 0) {
      const restaurants = this.storage.get<any[]>('restaurants') || [];
      if (restaurants.length >= 3) {
        const initialZonas: Zona[] = [
          // Restaurante 1: La Terraza
          {
            id: uuidv4(),
            nombre: 'Terraza Exterior',
            restauranteId: restaurants[0].id,
            horariosDisponibles: ['12:00', '13:00', '14:00', '20:00', '21:00', '22:00'],
            activo: true
          },
          {
            id: uuidv4(),
            nombre: 'Salón Principal',
            restauranteId: restaurants[0].id,
            horariosDisponibles: ['12:00', '13:00', '14:00', '15:00', '20:00', '21:00', '22:00', '23:00'],
            activo: true
          },
          {
            id: uuidv4(),
            nombre: 'Área VIP',
            restauranteId: restaurants[0].id,
            horariosDisponibles: ['19:00', '20:00', '21:00', '22:00', '23:00'],
            activo: true
          },
          // Restaurante 2: El Jardín
          {
            id: uuidv4(),
            nombre: 'Jardín de Invierno',
            restauranteId: restaurants[1].id,
            horariosDisponibles: ['11:00', '12:00', '13:00', '14:00', '19:00', '20:00', '21:00'],
            activo: true
          },
          {
            id: uuidv4(),
            nombre: 'Patio Central',
            restauranteId: restaurants[1].id,
            horariosDisponibles: ['12:00', '13:00', '14:00', '15:00', '20:00', '21:00', '22:00'],
            activo: true
          },
          {
            id: uuidv4(),
            nombre: 'Salón Privado',
            restauranteId: restaurants[1].id,
            horariosDisponibles: ['13:00', '14:00', '20:00', '21:00', '22:00'],
            activo: true
          },
          // Restaurante 3: Parrilla Don José
          {
            id: uuidv4(),
            nombre: 'Salón de Parrilla',
            restauranteId: restaurants[2].id,
            horariosDisponibles: ['12:00', '13:00', '14:00', '15:00', '20:00', '21:00', '22:00', '23:00'],
            activo: true
          },
          {
            id: uuidv4(),
            nombre: 'Terraza Techada',
            restauranteId: restaurants[2].id,
            horariosDisponibles: ['12:00', '13:00', '14:00', '20:00', '21:00', '22:00'],
            activo: true
          },
          {
            id: uuidv4(),
            nombre: 'Bar y Lounge',
            restauranteId: restaurants[2].id,
            horariosDisponibles: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'],
            activo: true
          }
        ];
        this.storage.set(this.STORAGE_KEY, initialZonas);
      }
    }
  }

  getAll(): Zona[] {
    const zonas = this.storage.get<Zona[]>(this.STORAGE_KEY) || [];
    return zonas.map(zona => ({
      ...zona,
      horariosDisponibles: this.expandHorarios(zona.horariosDisponibles)
    }));
  }

  getActive(): Zona[] {
    return this.getAll().filter(z => z.activo);
  }

  getByRestaurant(restauranteId: string): Zona[] {
    return this.getAll().filter(z => z.restauranteId === restauranteId && z.activo);
  }

  getById(id: string): Zona | undefined {
    return this.getAll().find(z => z.id === id);
  }

  create(zona: Omit<Zona, 'id'>): Zona {
    const zonas = this.getAll();
    const newZona: Zona = {
      ...zona,
      id: uuidv4()
    };
    zonas.push(newZona);
    this.storage.set(this.STORAGE_KEY, zonas);
    return newZona;
  }

  update(id: string, data: Partial<Zona>): Zona | null {
    const zonas = this.getAll();
    const index = zonas.findIndex(z => z.id === id);
    if (index === -1) return null;
    
    zonas[index] = { ...zonas[index], ...data };
    this.storage.set(this.STORAGE_KEY, zonas);
    return zonas[index];
  }

  delete(id: string): boolean {
    const canDelete = this.canDeleteZone(id);
    if (!canDelete.can) return false;

    const zonas = this.getAll();
    const index = zonas.findIndex(z => z.id === id);
    if (index === -1) return false;

    zonas[index].activo = false;
    this.storage.set(this.STORAGE_KEY, zonas);
    return true;
  }

  addHorario(zonaId: string, horario: string): boolean {
    const zona = this.getById(zonaId);
    if (!zona) return false;

    if (!zona.horariosDisponibles.includes(horario)) {
      zona.horariosDisponibles.push(horario);
      zona.horariosDisponibles.sort();
      this.update(zonaId, { horariosDisponibles: zona.horariosDisponibles });
    }
    return true;
  }

  removeHorario(zonaId: string, horario: string): boolean {
    const zona = this.getById(zonaId);
    if (!zona) return false;

    zona.horariosDisponibles = zona.horariosDisponibles.filter(h => h !== horario);
    this.update(zonaId, { horariosDisponibles: zona.horariosDisponibles });
    return true;
  }

  canDeleteZone(id: string): { can: boolean; reason?: string } {
    // Verificar si tiene mesas con reservas activas
    return { can: true };
  }
}
