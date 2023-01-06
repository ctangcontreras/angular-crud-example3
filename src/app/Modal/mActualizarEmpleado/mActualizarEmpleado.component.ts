import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DownloadFile, toFile } from 'src/app/Base/Util';
import { DialogData } from 'src/app/content/expedienteExterno/expedienteExterno.component';
import { ServiceService } from 'src/app/Service/service.service';
import { MConfirmExpedienteComponent } from '../mConfirmExpediente/mConfirmExpediente.component';
import { MSpinnerComponent } from '../mSpinner/mSpinner.component';

@Component({
  selector: 'app-mActualizarEmpleado',
  templateUrl: './mActualizarEmpleado.component.html',
  styleUrls: ['./mActualizarEmpleado.component.scss']
})
export class MActualizarEmpleadoComponent implements OnInit {

  formGroupParent:any = [];
  datoActualizar:any = [];
  listComboCargos: any =[];
  listComboAreas: any =[];
  documentTdr:any = [];
  pipe = new DatePipe('en-US');
  archivos:String = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<MActualizarEmpleadoComponent>,
    private service: ServiceService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,

  ) {
    /*this.formGroupParent = this.fb.group({
      dni: new FormControl('',[Validators.required]),
      ruc: new FormControl('',[Validators.required]),
      apellidos: new FormControl('',[Validators.required]),
      nombres: new FormControl('',[Validators.required]),
      numCelular: new FormControl('',[Validators.required]),
      operado: new FormControl('',[Validators.required]),
      correo: new FormControl('',[Validators.required]),
      direccion: new FormControl('',[Validators.required]),
      numContrato: new FormControl('',[Validators.required]),
      docTDR: new FormControl('',[Validators.required]),
      fechInicio: new FormControl('',[Validators.required]),
      fechFin: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required]),
      cargo: new FormControl('',[Validators.required]),
      motivoAct: new FormControl('',[Validators.required]),
    });*/
   }

  ngOnInit() {
    this.spinner.hide();
    this.datoActualizar = this.data;
    for (let elemt of this.datoActualizar) {
      this.documentTdr.archivo = elemt.name.tdr;
      this.documentTdr.dni = elemt.name.dni;
      this.formGroupParent = this.fb.group({
        dni: [elemt.name.dni, Validators.required],
        ruc: [elemt.name.ruc],
        apellidos: [elemt.name.apellidos, Validators.required],
        nombres: [elemt.name.nombres, Validators.required],
        numCelular: [elemt.name.celular, Validators.required],
        operado: [elemt.name.descripcion, Validators.required],
        correo: new FormControl(elemt.name.correo,[Validators.required, Validators.email]),
        direccion: [elemt.name.direccion, Validators.required],
        numContrato: [elemt.name.correlativo, Validators.required],
        docTDR: [toFile(elemt.name.tdr, elemt.name.dni+'_TDR.pdf', 'application/octet-stream'), Validators.required],
        fechInicio: [elemt.name.fechaInicio, Validators.required],
        fechFin: [elemt.name.fechaFin, Validators.required],
        area: [elemt.name.idArea, Validators.required],
        cargo: [elemt.name.idCargo, Validators.required],
        motivoAct: new FormControl('',[Validators.required]),
        usuario: new FormControl(elemt.name.usuario,[Validators.required]),
        fechaNaci: new FormControl(elemt.name.fNacimiento,[Validators.required]),
      });
    }
    this.listComboArea();
    this.listComboCargo();
  }
  listComboCargo(){
    this.service.ListarComboCargo().subscribe(
      (result:any)=>{
        this.listComboCargos = result;
        console.log(result);
      }
    );
  }
  listComboArea(){
    this.service.ListarComboArea().subscribe(
      (result:any)=>{
        this.listComboAreas = result;
        console.log(result);
      }
    );
  }
  openDialog(): void {
    this.formGroupParent.markAllAsTouched();
    if(this.formGroupParent.invalid){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de actualización'});
      return;
    }
    const dialogRef = this.dialog.open(MConfirmExpedienteComponent, {
      width: '280px',
      data: {name: this.data},
      disableClose: true ,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Guardar'){
        this.actualizarPersona();
      }else{
        return;
      }
      console.log('The dialog was closed',result);
      //this.guardar = result;
    });
  }
  actualizarPersona(){
    let idPersona: number = 0;
    for (let element of this.datoActualizar) {
      idPersona = element.name.idPersona;
    }
    let fechNacimiento:any = this.pipe.transform(this.formGroupParent.value?.fechaNaci, 'YYYY-MM-dd');
    let param ={
      "idPersona": idPersona,
      "dni": this.formGroupParent.controls.dni.value,
      "apellidos": ""+this.formGroupParent.controls.apellidos.value,
      "nombres": ""+this.formGroupParent.controls.nombres.value,
      "ruc": ""+this.formGroupParent.controls.ruc.value,
      "razonSocial": "",
      "direccion": ""+this.formGroupParent.controls.direccion.value,
      "fechNacimiento": ""+fechNacimiento
    }
    console.log(param);
    this.spinner.show();
    this.service.editarPersona(param).subscribe(
      (result:any)=>{
        console.log("aquiii111",result);
        this.actualizarEmpleado();
      },(error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      });
  }

  actualizarEmpleado(){
    let idPersona: number = 0;
    let idEmpleado: number = 0;
    let tdr:String = '';
    this.formGroupParent.markAllAsTouched();
    if(this.formGroupParent.invalid){
      return;
    }for (let element of this.datoActualizar) {
      idPersona = element.name.idPersona;
      idEmpleado = element.name.idEmpleado;
      tdr = element.name.archivo;
    }
    let fechIni:any = this.pipe.transform(this.formGroupParent.value?.fechInicio, 'YYYY-MM-dd');
    let fechFin:any = this.pipe.transform(this.formGroupParent.value?.fechFin, 'YYYY-MM-dd');
    let param = {
      "idPersona": idPersona,
      "idArea": this.formGroupParent.controls.area.value,
      "idCargo": this.formGroupParent.controls.cargo.value,
      "correlativo": ""+this.formGroupParent.controls.numContrato.value,
      "tdr": ""+this.archivos? this.archivos: tdr,
      "fechaInicio": ""+fechIni,
      "fechafin": ""+fechFin,
      "login": ""+this.formGroupParent.controls.usuario.value,
      "celular": this.formGroupParent.controls.numCelular.value,
      "correo": ""+this.formGroupParent.controls.correo.value,
      "descripcion": ""+this.formGroupParent.controls.operado.value,
      "idEmpleado": idEmpleado
    }
    console.log("cargardatosssss",param);
    this.service.editarEmpleado(param).subscribe(
      (result:any)=>{
        if(result.result != 0){
          this.dialogRef.close("Guardado");
          this.spinner.hide();
          console.log("aquiii",result);
        }else{
          this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Ocurrio un problema al actualizar empleado'});
          console.log("cerrar Modal:  ");
          this.spinner.hide();
        }
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      });
  }
  cargarpdf() {
    const file: File = this.formGroupParent.controls.docTDR.value;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log("documento PDF",reader.result);
      this.archivos = String(reader.result);
    };
  }
  descargar(param: any) {
    DownloadFile(param.archivo, param.dni+'_TDR.pdf', 'application/octet-stream')
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
}
