import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MesasService } from '../../../services/mesas.service';
import { ZonesService } from '../../../services/zones.service';
import { Mesa } from '../../../models/mesa.model';
import { Zona } from '../../../models/zona.model';

@Component({
  selector: 'app-mesa-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './mesa-form-dialog.component.html',
  styleUrl: './mesa-form-dialog.component.css'
})
export class MesaFormDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  zones: Zona[] = [];

  constructor(
    private fb: FormBuilder,
    private mesasService: MesasService,
    private zonesService: ZonesService,
    public dialogRef: MatDialogRef<MesaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mesa | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      zonaId: ['', Validators.required],
      capacidad: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      activa: [true]
    });
  }

  ngOnInit(): void {
    this.zones = this.zonesService.getAll().filter(z => z.activo);
    
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedZone = this.zones.find(z => z.id === formValue.zonaId);
      
      if (!selectedZone) {
        return;
      }
      
      if (this.isEdit && this.data) {
        const updated: Mesa = {
          ...this.data,
          ...formValue
        };
        this.mesasService.update(this.data.id, formValue);
      } else {
        this.mesasService.create({
          numero: formValue.numero,
          zonaId: formValue.zonaId,
          restauranteId: selectedZone.restauranteId,
          capacidad: formValue.capacidad,
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
