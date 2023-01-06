import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { DownloadFile } from 'src/app/Base/Util';
import { MActualizarEmpleadoComponent } from 'src/app/Modal/mActualizarEmpleado/mActualizarEmpleado.component';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ServiceService } from 'src/app/Service/service.service';
export interface PeriodicElement {
  dni ?: number;
  empleado ?: string;
  area ?: string;
  cargo ?: string;
  archivo ?: string;
  apellidos?: string;
  celular?: string;
  correlativo?: string;
  correo?: string;
  descripcion?: string;
  direccion?: string;
  fecha?: string;
  fechaFin?: string;
  fechaInicio?: string;
  idArea?: number;
  idCargo?: number;
  nombres?: string;
  ruc?: string;
  tdr?: string;
  idEmpleado?: number;
  idPersona?: number;
  usuario?: String;
  fNacimiento?: String;
}

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadoComponent implements OnInit {

  formGroupParent:any = [];
  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    public dialog: MatDialog,
    private messageService: MessageService,
  ) {
    this.formGroupParent = this.fb.group({
      dni: [''],
      apenom: [''],
    });
  }

  ngOnInit( ) {

  }
  displayedColumns: string[] = ['dni', 'empleado','nacimiento', 'area', 'cargo', 'accion'];
  dataSource: PeriodicElement[] = [];
  clickedRows = new Set<PeriodicElement>();
  clic(e:any){
    console.log('holaaaaaaaa', e);
  }
  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  listaEmpleado() {
    this.dataSource = [];
    let params: any = {
      "dni": this.formGroupParent.controls.dni.value.length > 0 ? +this.formGroupParent.controls.dni.value : 0,
      "apNombres": this.formGroupParent.controls.apenom.value
    }
    this.openSpinner();
    this.service.lisEmpleado(params).subscribe(
      (result:any)=>{
        this.dialog.closeAll();
        console.log("result",result);
        if(result.length > 0){
            result.forEach((element: any) => {
              this.dataSource.push({
                dni: element.dni,
                empleado: element.apellidos +' '+ element.nombres,
                area: element.area,
                cargo: element.cargo,
                archivo: String(element.tdr),

                apellidos: element.apellidos,
                celular: element.celular,
                correlativo: element.correlativo,
                correo: element.correo,
                descripcion: element.descripcion,
                direccion: element.direccion,
                fecha: element.fecha,
                fechaFin: element.fechaFin,
                fechaInicio: element.fechaInicio,
                idArea: element.idArea,
                idCargo: element.idCargo,
                nombres: element.nombres,
                ruc: element.ruc,
                tdr: element.tdr,
                idEmpleado: element.idEmpleado,
                idPersona: element.idPersona,
                usuario: element.usuario,
                fNacimiento: element.fnacimiento,
              });
            });
        }
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      }
    )
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyLetras(event: any) {
    const pattern = /[A-Z ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  limpiar(){
    this.formGroupParent.controls.dni.setValue('');
    this.formGroupParent.controls.apenom.setValue('');
    this.dataSource = [];
  }

  descargar(param: any) {
    DownloadFile(param.archivo, param.dni+'_TDR.pdf', 'application/octet-stream')
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, element:any): void {
    const dialogRef = this.dialog.open(MActualizarEmpleadoComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true ,
      width: '750px',
      data: [{name:element}],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result != true){
        this.listaEmpleado();
        this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'El empleado se actualizó correctamente'});
      }
      //this.guardar = result;
    });
  }

}
