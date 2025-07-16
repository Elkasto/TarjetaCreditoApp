
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarjeta-form.component.html',
  styleUrls: ['./tarjeta-form.component.css']
})
export class TarjetaFormComponent implements OnChanges {
  @Input() accion: string = 'Agregar';
  @Input() tarjetaEditada: any = null;
  @Output() onGuardar = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tarjetaEditada'] && this.tarjetaEditada) {
      this.form.patchValue(this.tarjetaEditada);
    }
  }

  formatExpiration(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    this.form.get('fechaExpiracion')?.setValue(value, { emitEvent: false });
  }

  guardar() {
    const value = this.form.value;
    const [monthStr, yearStr] = value.fechaExpiracion.split('/');
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (
      isNaN(month) || isNaN(year) ||
      month < 1 || month > 12 ||
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      alert('Fecha de expiración inválida o vencida');
      return;
    }

    this.onGuardar.emit(value);
    this.form.reset();
  }
}
