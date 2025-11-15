import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MesasService } from '../../../services/mesas.service';
import { ZonesService } from '../../../services/zones.service';
import { Mesa } from '../../../models/mesa.model';
import { MesaFormDialogComponent } from '../mesa-form-dialog/mesa-form-dialog.component';

@Component({
  selector: 'app-mesa-list',
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
  templateUrl: './mesa-list.component.html',
  styleUrl: './mesa-list.component.css'
})
export class MesaListComponent implements OnInit {
  mesas: Mesa[] = [];
  displayedColumns: string[] = ['numero', 'zona', 'capacidad', 'activo', 'acciones'];

  constructor(
    private mesasService: MesasService,
    private zonesService: ZonesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMesas();
  }

  loadMesas(): void {
    this.mesas = this.mesasService.getAll();
  }

  getZoneName(zoneId: string): string {
    const zone = this.zonesService.getById(zoneId);
    return zone?.nombre || 'N/A';
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(MesaFormDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMesas();
        this.snackBar.open('Mesa creada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  openEditDialog(mesa: Mesa): void {
    const dialogRef = this.dialog.open(MesaFormDialogComponent, {
      width: '500px',
      data: mesa
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMesas();
        this.snackBar.open('Mesa actualizada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  toggleActive(mesa: Mesa): void {
    const newStatus = !mesa.activo;
    
    this.mesasService.update(mesa.id, { activo: newStatus });
    this.loadMesas();
    
    const message = newStatus ? 'Mesa activada' : 'Mesa desactivada';
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }
}
