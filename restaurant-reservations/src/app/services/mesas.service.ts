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
      if (zonas.length >= 9) {
        const initialMesas: Mesa[] = [
          // Zona 1: Terraza Exterior (La Terraza)
          {
            id: uuidv4(),
            numero: 'T1',
            capacidad: 2,
            zonaId: zonas[0].id,
            restauranteId: zonas[0].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'T2',
            capacidad: 4,
            zonaId: zonas[0].id,
            restauranteId: zonas[0].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'T3',
            capacidad: 6,
            zonaId: zonas[0].id,
            restauranteId: zonas[0].restauranteId,
            activo: true
          },
          // Zona 2: Salón Principal (La Terraza)
          {
            id: uuidv4(),
            numero: 'S1',
            capacidad: 4,
            zonaId: zonas[1].id,
            restauranteId: zonas[1].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'S2',
            capacidad: 6,
            zonaId: zonas[1].id,
            restauranteId: zonas[1].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'S3',
            capacidad: 8,
            zonaId: zonas[1].id,
            restauranteId: zonas[1].restauranteId,
            activo: true
          },
          // Zona 3: Área VIP (La Terraza)
          {
            id: uuidv4(),
            numero: 'V1',
            capacidad: 4,
            zonaId: zonas[2].id,
            restauranteId: zonas[2].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'V2',
            capacidad: 6,
            zonaId: zonas[2].id,
            restauranteId: zonas[2].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'V3',
            capacidad: 10,
            zonaId: zonas[2].id,
            restauranteId: zonas[2].restauranteId,
            activo: true
          },
          // Zona 4: Jardín de Invierno (El Jardín)
          {
            id: uuidv4(),
            numero: 'J1',
            capacidad: 2,
            zonaId: zonas[3].id,
            restauranteId: zonas[3].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'J2',
            capacidad: 4,
            zonaId: zonas[3].id,
            restauranteId: zonas[3].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'J3',
            capacidad: 6,
            zonaId: zonas[3].id,
            restauranteId: zonas[3].restauranteId,
            activo: true
          },
          // Zona 5: Patio Central (El Jardín)
          {
            id: uuidv4(),
            numero: 'P1',
            capacidad: 3,
            zonaId: zonas[4].id,
            restauranteId: zonas[4].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'P2',
            capacidad: 4,
            zonaId: zonas[4].id,
            restauranteId: zonas[4].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'P3',
            capacidad: 8,
            zonaId: zonas[4].id,
            restauranteId: zonas[4].restauranteId,
            activo: true
          },
          // Zona 6: Salón Privado (El Jardín)
          {
            id: uuidv4(),
            numero: 'SP1',
            capacidad: 6,
            zonaId: zonas[5].id,
            restauranteId: zonas[5].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'SP2',
            capacidad: 8,
            zonaId: zonas[5].id,
            restauranteId: zonas[5].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'SP3',
            capacidad: 12,
            zonaId: zonas[5].id,
            restauranteId: zonas[5].restauranteId,
            activo: true
          },
          // Zona 7: Salón de Parrilla (Parrilla Don José)
          {
            id: uuidv4(),
            numero: 'PA1',
            capacidad: 4,
            zonaId: zonas[6].id,
            restauranteId: zonas[6].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'PA2',
            capacidad: 6,
            zonaId: zonas[6].id,
            restauranteId: zonas[6].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'PA3',
            capacidad: 8,
            zonaId: zonas[6].id,
            restauranteId: zonas[6].restauranteId,
            activo: true
          },
          // Zona 8: Terraza Techada (Parrilla Don José)
          {
            id: uuidv4(),
            numero: 'TT1',
            capacidad: 2,
            zonaId: zonas[7].id,
            restauranteId: zonas[7].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'TT2',
            capacidad: 4,
            zonaId: zonas[7].id,
            restauranteId: zonas[7].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'TT3',
            capacidad: 6,
            zonaId: zonas[7].id,
            restauranteId: zonas[7].restauranteId,
            activo: true
          },
          // Zona 9: Bar y Lounge (Parrilla Don José)
          {
            id: uuidv4(),
            numero: 'B1',
            capacidad: 2,
            zonaId: zonas[8].id,
            restauranteId: zonas[8].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'B2',
            capacidad: 4,
            zonaId: zonas[8].id,
            restauranteId: zonas[8].restauranteId,
            activo: true
          },
          {
            id: uuidv4(),
            numero: 'B3',
            capacidad: 6,
            zonaId: zonas[8].id,
            restauranteId: zonas[8].restauranteId,
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
