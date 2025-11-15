import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './restaurant-form-dialog.component.html',
  styleUrl: './restaurant-form-dialog.component.css'
})
export class RestaurantFormDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    public dialogRef: MatDialogRef<RestaurantFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Restaurant | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      if (this.isEdit && this.data) {
        const updated: Restaurant = {
          ...this.data,
          ...formValue
        };
        this.restaurantService.update(this.data.id, formValue);
      } else {
        this.restaurantService.create({ nombre: formValue.nombre, activo: formValue.activo });
      }
      
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
