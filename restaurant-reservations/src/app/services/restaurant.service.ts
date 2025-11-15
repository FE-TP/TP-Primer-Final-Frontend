import { Injectable } from '@angular/core';
import { Restaurant } from '../models';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly STORAGE_KEY = 'restaurants';

  constructor(private storage: StorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    const existing = this.getAll();
    if (existing.length === 0) {
      const initialRestaurants: Restaurant[] = [
        { id: uuidv4(), nombre: 'La Terraza', activo: true },
        { id: uuidv4(), nombre: 'El Jardín', activo: true }
      ];
      this.storage.set(this.STORAGE_KEY, initialRestaurants);
    }
  }

  getAll(): Restaurant[] {
    return this.storage.get<Restaurant[]>(this.STORAGE_KEY) || [];
  }

  getActive(): Restaurant[] {
    return this.getAll().filter(r => r.activo);
  }

  getById(id: string): Restaurant | undefined {
    return this.getAll().find(r => r.id === id);
  }

  create(restaurant: Omit<Restaurant, 'id'>): Restaurant {
    const restaurants = this.getAll();
    const newRestaurant: Restaurant = {
      ...restaurant,
      id: uuidv4()
    };
    restaurants.push(newRestaurant);
    this.storage.set(this.STORAGE_KEY, restaurants);
    return newRestaurant;
  }

  update(id: string, data: Partial<Restaurant>): Restaurant | null {
    const restaurants = this.getAll();
    const index = restaurants.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    restaurants[index] = { ...restaurants[index], ...data };
    this.storage.set(this.STORAGE_KEY, restaurants);
    return restaurants[index];
  }

  delete(id: string): boolean {
    const canDelete = this.canDeleteRestaurant(id);
    if (!canDelete.can) return false;

    const restaurants = this.getAll();
    const index = restaurants.findIndex(r => r.id === id);
    if (index === -1) return false;

    restaurants[index].activo = false;
    this.storage.set(this.STORAGE_KEY, restaurants);
    return true;
  }

  canDeleteRestaurant(id: string): { can: boolean; reason?: string } {
    // Verificar si tiene zonas/mesas con reservas activas
    // Esta lógica se implementará cuando tengamos los otros servicios
    return { can: true };
  }
}
