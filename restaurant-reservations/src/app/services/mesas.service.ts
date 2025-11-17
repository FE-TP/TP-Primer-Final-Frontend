import { Injectable } from '@angular/core';
import { Mesa } from '../models';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  private readonly STORAGE_KEY = 'mesas';

  constructor(private storage: StorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    const existing = this.getAll();
    if (existing.length === 0) {
      const zonas = this.storage.get<any[]>('zonas') || [];
      if (zonas.length > 0) {
        const initialMesas: Mesa[] = [
          {
            id: uuidv4(),
            numero: '1',
            capacidad: 2,
            zonaId: zonas[0].id,
            restauranteId: zonas[0].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: '2',
            capacidad: 4,
            zonaId: zonas[0].id,
            restauranteId: zonas[0].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: '3',
            capacidad: 6,
            zonaId: zonas[0].id,
            restauranteId: zonas[0].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: '10',
            capacidad: 4,
            zonaId: zonas[1].id,
            restauranteId: zonas[1].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: '11',
            capacidad: 8,
            zonaId: zonas[1].id,
            restauranteId: zonas[1].restauranteId,
            activo: true
          }
        ];
        this.storage.set(this.STORAGE_KEY, initialMesas);
      }
    }
  }

  getAll(): Mesa[] {
    return this.storage.get<Mesa[]>(this.STORAGE_KEY) || [];
  }

  getActive(): Mesa[] {
    return this.getAll().filter(m => m.activo);
  }

  getByZona(zonaId: string): Mesa[] {
    return this.getAll().filter(m => m.zonaId === zonaId && m.activo);
  }

  getByRestaurant(restauranteId: string): Mesa[] {
    return this.getAll().filter(m => m.restauranteId === restauranteId && m.activo);
  }

  getById(id: string): Mesa | undefined {
    return this.getAll().find(m => m.id === id);
  }

  create(mesa: Omit<Mesa, 'id'>): Mesa {
    const mesas = this.getAll();
    const newMesa: Mesa = {
      ...mesa,
      id: uuidv4()
    };
    mesas.push(newMesa);
    this.storage.set(this.STORAGE_KEY, mesas);
    return newMesa;
  }

  update(id: string, data: Partial<Mesa>): Mesa | null {
    const mesas = this.getAll();
    const index = mesas.findIndex(m => m.id === id);
    if (index === -1) return null;
    
    mesas[index] = { ...mesas[index], ...data };
    this.storage.set(this.STORAGE_KEY, mesas);
    return mesas[index];
  }

  delete(id: string): boolean {
    const canDelete = this.canDeleteMesa(id);
    if (!canDelete.can) return false;

    const mesas = this.getAll();
    const index = mesas.findIndex(m => m.id === id);
    if (index === -1) return false;

    mesas[index].activo = false;
    this.storage.set(this.STORAGE_KEY, mesas);
    return true;
  }

  canDeleteMesa(id: string): { can: boolean; reason?: string } {
    // Verificar si tiene reservas activas
    return { can: true };
  }

  getMaxCapacityByZona(zonaId: string): number {
    const mesas = this.getByZona(zonaId);
    if (mesas.length === 0) return 0;
    return Math.max(...mesas.map(m => m.capacidad));
  }
}
