import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ZonesService } from '../../../services/zones.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { MesasService } from '../../../services/mesas.service';
import { Zona } from '../../../models/zona.model';
import { ZoneFormDialogComponent } from '../zone-form-dialog/zone-form-dialog.component';

@Component({
  selector: 'app-zone-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './zone-list.component.html',
  styleUrl: './zone-list.component.css'
})
export class ZoneListComponent implements OnInit {
  zones: Zona[] = [];
  displayedColumns: string[] = ['nombre', 'restaurante', 'horarios', 'activo', 'mesas', 'acciones'];

  constructor(
    private zonesService: ZonesService,
    private restaurantService: RestaurantService,
    private mesasService: MesasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadZones();
  }

  loadZones(): void {
    this.zones = this.zonesService.getAll();
  }

  getRestaurantName(restaurantId: string): string {
    const restaurant = this.restaurantService.getById(restaurantId);
    return restaurant?.nombre || 'N/A';
  }

  getTableCount(zoneId: string): number {
    return this.mesasService.getByZona(zoneId).length;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ZoneFormDialogComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZones();
        this.snackBar.open('Zona creada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  openEditDialog(zone: Zona): void {
    const dialogRef = this.dialog.open(ZoneFormDialogComponent, {
      width: '600px',
      data: zone
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZones();
        this.snackBar.open('Zona actualizada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  toggleActive(zone: Zona): void {
    const newStatus = !zone.activo;
    
    // Si se intenta desactivar, verificar mesas
    if (!newStatus) {
      const tables = this.mesasService.getByZona(zone.id);
      const hasActiveTables = tables.some(t => t.activo);
      
      if (hasActiveTables) {
        this.snackBar.open(
          'No se puede desactivar: hay mesas activas asociadas',
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
        return;
      }
    }

    this.zonesService.update(zone.id, { activo: newStatus });
    this.loadZones();
    
    const message = newStatus ? 'Zona activada' : 'Zona desactivada';
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }
}
