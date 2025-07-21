import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaService } from '../../services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';
import { TarjetaHeaderComponent } from './tarjeta-header/tarjeta-header.component';
import { TarjetaFormComponent } from './tarjeta-form/tarjeta-form.component';
import { TarjetaListComponent } from './tarjeta-list/tarjeta-list.component';

@Component({
  selector: 'app-tarjeta-credito',
  standalone: true,
  imports: [
    CommonModule,
    TarjetaHeaderComponent,
    TarjetaFormComponent,
    TarjetaListComponent
  ],
  templateUrl: './tarjeta-credito.component.html',
})
export class TarjetaCreditoComponent {
  listTarjetas: any[] = [];
  accion: string = 'Agregar';
  tarjetaEditada: any = null;

  constructor(private toastr: ToastrService, private _tarjetaService: TarjetaService) {}

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  guardarTarjeta(data: any): void {
    console.log('Datos a guardar: ', data);
    if (this.tarjetaEditada) {
      console.log('Editando tarjeta con ID:', this.tarjetaEditada.id);
      this._tarjetaService.updateTarjeta(this.tarjetaEditada.id, data).subscribe({
        next: () => {
          this.toastr.info('La tarjeta fue actualizada exitosamente', 'Tarjeta Actualizada');
          this.tarjetaEditada = null;
          this.accion = 'Agregar';
          this.obtenerTarjetas();
        },
        error: (err) => {
          this.toastr.error('Ocurrió un error al actualizar la tarjeta', 'Error');
          console.error(err);
        }
      });
    } else {
      console.log('Guardando nueva tarjeta');
      this._tarjetaService.saveTarjeta(data).subscribe({
        next: () => {
          this.toastr.success('La tarjeta ha sido registrada con éxito!', 'Tarjeta Registrada');
          this.obtenerTarjetas();
        },
        error: (err) => {
          this.toastr.error('Ocurrió un error al guardar la tarjeta', 'Error');
          console.error(err);
        }
      });
    }
  }

  editarTarjeta(tarjeta: any): void {
    this.tarjetaEditada = tarjeta;
    this.accion = 'Editar';
  }

  eliminarTarjeta(id: number): void {
    this._tarjetaService.deleteTarjeta(id).subscribe({
      next: () => {
        this.toastr.error('La tarjeta fue eliminada correctamente', 'Tarjeta Eliminada');
        this.obtenerTarjetas();
      },
      error: (err) => {
        this.toastr.error('Ocurrió un error al eliminar la tarjeta', 'Error');
        console.error(err);
      }
    });
  }

  obtenerTarjetas(): void {
    this._tarjetaService.getListTarjetas().subscribe({
      next: (data) => this.listTarjetas = data,
      error: (err) => {
        this.toastr.error('No se pudieron cargar las tarjetas', 'Error');
        console.error(err);
      }
    });
  }
}

