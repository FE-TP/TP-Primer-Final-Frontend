import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RestaurantService } from '../../../services/restaurant.service';
import { ZonesService } from '../../../services/zones.service';
import { Restaurant } from '../../../models/restaurant.model';
import { RestaurantFormDialogComponent } from '../restaurant-form-dialog/restaurant-form-dialog.component';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css'
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  displayedColumns: string[] = ['nombre', 'activo', 'zonas', 'acciones'];

  constructor(
    private restaurantService: RestaurantService,
    private zonesService: ZonesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurants = this.restaurantService.getAll();
  }

  getZoneCount(restaurantId: string): number {
    return this.zonesService.getByRestaurant(restaurantId).length;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(RestaurantFormDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRestaurants();
        this.snackBar.open('Restaurante creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  openEditDialog(restaurant: Restaurant): void {
    const dialogRef = this.dialog.open(RestaurantFormDialogComponent, {
      width: '500px',
      data: restaurant
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRestaurants();
        this.snackBar.open('Restaurante actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  toggleActive(restaurant: Restaurant): void {
    const newStatus = !restaurant.activo;
    
    // Si se intenta desactivar, verificar zonas
    if (!newStatus) {
      const zones = this.zonesService.getByRestaurant(restaurant.id);
      const hasActiveZones = zones.some(z => z.activo);
      
      if (hasActiveZones) {
        this.snackBar.open(
          'No se puede desactivar: hay zonas activas asociadas',
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
        return;
      }
    }

    this.restaurantService.update(restaurant.id, { activo: newStatus });
    this.loadRestaurants();
    
    const message = newStatus ? 'Restaurante activado' : 'Restaurante desactivado';
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }
}
