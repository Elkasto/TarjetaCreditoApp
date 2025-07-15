import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from '../../services/tarjeta.service';
import { error } from 'console';


@Component({
  selector: 'app-tarjeta-credito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent {
  listTarjetas: any[] = [];
  accion = 'Agregar';  
  form: FormGroup;
  id: number | undefined;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
  private _tarjetaService: TarjetaService){
    this.form = this.fb.group({
      titular: ["", Validators.required],
      numeroTarjeta: ["", [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ["", [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ["", [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
  }

  guardarTarjeta(){
    
    const tarjeta: any ={
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value
      }

      const [monthStr, yearStr] = tarjeta.fechaExpiracion.split('/');
      const month = parseInt(monthStr);
      const year = parseInt(yearStr);
      const current = new Date();
      const currentYear = current.getFullYear() % 100;
      const currentMonth = current.getMonth() + 1;

      if (
        isNaN(month) || isNaN(year) ||
        month < 1 || month > 12 ||
        year < currentYear ||
        (year === currentYear && month < currentMonth)
        ){
          this.toastr.error('La tarjeta está vencida o tiene un formato de fecha inválido.', 'Fecha inválida');
          return;
        }

    if(this.id == undefined){
      //Agregar tarjeta
        this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('La tarjeta ha sido registrada con éxito!', 'Tarjeta Registrada');
        this.obtenerTarjetas();
        this.form.reset();
        }, error => {
          this.toastr.error('Oh, Ocurrio un error', 'Error');
          console.log(error);
          console.log(error.error.errors);
    })
    }else{
      //Editar tarjeta
        tarjeta.id = this.id;
        this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data =>{
          this.form.reset();
          this.accion = 'Agregar';
          this.id = undefined;
          this.toastr.info('La tarjeta fue actualizada exitosamente', 'Tarjeta Actualizada');
          this.obtenerTarjetas();
        }, error => {
          console.log(error);
        })
    }

  }

  eliminarTarjeta(id: number){
    if (confirm('¿Está seguro de eliminar esta tarjeta?')) {
      this._tarjetaService.deleteTarjeta(id).subscribe(data =>{
        this.toastr.error('La tarjeta ha sido eliminada con éxito!', 'Tarjeta Eliminada');
        this.obtenerTarjetas();
      }, error => {
        console.log(error);
      });
    }
  }


  obtenerTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe({
      next: (data) => {
        console.log(data);
        this.listTarjetas = data;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  editarTarjeta(tarjeta: any) {
    this.accion = 'editar';
    this.id = tarjeta.id;
    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: this.formatCardNumber(tarjeta.numeroTarjeta),
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })
  }

  
  formatCardNumber(value: string): string {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  

  formatExpiration(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    this.form.get('fechaExpiracion')?.setValue(value, { emitEvent: false });
  }

  maskCardNumber(numero: string): string {
    return '**** **** **** ' + numero.slice(-4);
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }
}

