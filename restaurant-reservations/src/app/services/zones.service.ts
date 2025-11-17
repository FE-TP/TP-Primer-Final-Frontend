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

  private initializeData(): void {
    const existing = this.getAll();
    if (existing.length === 0) {
      const restaurants = this.storage.get<any[]>('restaurants') || [];
      if (restaurants.length > 0) {
        const initialZonas: Zona[] = [
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
          }
        ];
        this.storage.set(this.STORAGE_KEY, initialZonas);
      }
    }
  }

  getAll(): Zona[] {
    return this.storage.get<Zona[]>(this.STORAGE_KEY) || [];
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
