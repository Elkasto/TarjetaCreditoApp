import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-list.component.html',
})
export class TarjetaListComponent {
  @Input() tarjetas: any[] = [];
  @Output() onEditar = new EventEmitter<any>();
  @Output() onEliminar = new EventEmitter<number>();

  maskCardNumber(numero: string): string {
    return '**** **** **** ' + numero.slice(-4);
  }

  confirmarEliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar esta tarjeta?')) {
      this.onEliminar.emit(id);
    }
  }
}
