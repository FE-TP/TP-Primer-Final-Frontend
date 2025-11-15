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
  availableHorarios = ['Almuerzo', 'Cena', 'Todo el día', 'Desayuno', 'Brunch'];
  selectedHorarios: string[] = [];

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
      this.selectedHorarios = [...this.data.horariosDisponibles];
    }
  }

  toggleHorario(horario: string): void {
    const index = this.selectedHorarios.indexOf(horario);
    if (index >= 0) {
      this.selectedHorarios.splice(index, 1);
    } else {
      this.selectedHorarios.push(horario);
    }
  }

  isHorarioSelected(horario: string): boolean {
    return this.selectedHorarios.includes(horario);
  }

  onSubmit(): void {
    if (this.form.valid && this.selectedHorarios.length > 0) {
      const formValue = this.form.value;
      
      if (this.isEdit && this.data) {
        this.zonesService.update(this.data.id, {
          nombre: formValue.nombre,
          restauranteId: formValue.restauranteId,
          horariosDisponibles: this.selectedHorarios,
          activo: formValue.activa
        });
      } else {
        this.zonesService.create({
          nombre: formValue.nombre,
          restauranteId: formValue.restauranteId,
          horariosDisponibles: this.selectedHorarios,
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
