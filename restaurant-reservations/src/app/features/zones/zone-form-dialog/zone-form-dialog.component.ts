import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ZonesService } from '../../../services/zones.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { Zona } from '../../../models/zona.model';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-zone-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './zone-form-dialog.component.html',
  styleUrl: './zone-form-dialog.component.css'
})
export class ZoneFormDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  restaurants: Restaurant[] = [];
  horas: number[] = Array.from({ length: 24 }, (_, i) => i); // 0 a 23
  horasHasta: number[] = [];
  generatedHorarios: string[] = [];

  constructor(
    private fb: FormBuilder,
    private zonesService: ZonesService,
    private restaurantService: RestaurantService,
    public dialogRef: MatDialogRef<ZoneFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Zona | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      restauranteId: ['', Validators.required],
      horaDesde: ['', Validators.required],
      horaHasta: ['', Validators.required],
      activa: [true]
    });
  }

  ngOnInit(): void {
    this.restaurants = this.restaurantService.getAll().filter(r => r.activo);
    
    if (this.data) {
      this.form.patchValue({
        nombre: this.data.nombre,
        restauranteId: this.data.restauranteId,
        activa: this.data.activo
      });
      
      // Intentar parsear los horarios existentes para extraer desde/hasta
      if (this.data.horariosDisponibles.length > 0) {
        const firstHorario = this.data.horariosDisponibles[0];
        const lastHorario = this.data.horariosDisponibles[this.data.horariosDisponibles.length - 1];
        
        // Extraer hora de inicio del primer horario (ej: "12:00" -> 12)
        const horaDesde = parseInt(firstHorario.split(':')[0]);
        // Extraer hora de fin del último horario (ej: "22:00" -> 22)
        const horaHasta = parseInt(lastHorario.split(':')[0]);
        
        this.form.patchValue({
          horaDesde: horaDesde,
          horaHasta: horaHasta
        });
        
        this.updateHorasHasta();
        this.generateHorarios();
      }
    }
  }

  onHorarioChange(): void {
    this.updateHorasHasta();
    this.generateHorarios();
  }

  updateHorasHasta(): void {
    const horaDesde = this.form.get('horaDesde')?.value;
    if (horaDesde !== null && horaDesde !== '') {
      // Horas disponibles desde horaDesde + 1 hasta 23
      this.horasHasta = Array.from({ length: 24 - horaDesde - 1 }, (_, i) => horaDesde + 1 + i);
    } else {
      this.horasHasta = [];
    }
  }

  generateHorarios(): void {
    const horaDesde = this.form.get('horaDesde')?.value;
    const horaHasta = this.form.get('horaHasta')?.value;
    
    this.generatedHorarios = [];
    
    if (horaDesde !== null && horaDesde !== '' && horaHasta !== null && horaHasta !== '' && horaDesde < horaHasta) {
      for (let i = horaDesde; i <= horaHasta; i++) {
        const hora = i.toString().padStart(2, '0');
        this.generatedHorarios.push(`${hora}:00`);
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.generatedHorarios.length > 0) {
      const formValue = this.form.value;
      
      if (this.isEdit && this.data) {
        this.zonesService.update(this.data.id, {
          nombre: formValue.nombre,
          restauranteId: formValue.restauranteId,
          horariosDisponibles: this.generatedHorarios,
          activo: formValue.activa
        });
      } else {
        this.zonesService.create({
          nombre: formValue.nombre,
          restauranteId: formValue.restauranteId,
          horariosDisponibles: this.generatedHorarios,
          activo: formValue.activa
        });
      }
      
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
