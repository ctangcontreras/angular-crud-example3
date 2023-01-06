import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MConfirmExpedienteComponent } from 'src/app/Modal/mConfirmExpediente/mConfirmExpediente.component';
import { ServiceService } from 'src/app/Service/service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';


export interface DialogData {
  guardar: string;
}

@Component({
  selector: 'app-registrarUsuario',
  templateUrl: './registrarUsuario.component.html',
  styleUrls: ['./registrarUsuario.component.scss']
})
export class RegistrarUsuarioComponent implements OnInit {

  formGroupParent: any = [];
  isEditable = false;
  idPersona:number = 0;
  guardar:string = '';
  archivos:any =[];
  pipe = new DatePipe('en-US');
  listComboCargos :any= [];
  listComboAreas: any = [];
  resultadoRegistroEmpleado:any;
  minDate = new Date();

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
  ) {
    this.formGroupParent = this.fb.group({
      ruc: new FormControl (""),
      dni: new FormControl ("",[Validators.required]),
      nombres: new FormControl ("",[Validators.required]),
      apellidos: new FormControl ("",[Validators.required]),
      numCel: new FormControl ("",[Validators.required]),
      operador: new FormControl ("",[Validators.required]),
      numContrato: new FormControl ("",[Validators.required]),
      tdrPDF: new FormControl ("",[Validators.required]),
      fechInicioContrato: new FormControl ("",[Validators.required]),
      fechFinContrato: new FormControl ("",[Validators.required]),
      asigArea: new FormControl ("",[Validators.required]),
      asigCargo: new FormControl ("",[Validators.required]),
      correo: new FormControl ('',[Validators.required, Validators.email]),
      direccion: new FormControl ('', [Validators.required]),
      usuario: new FormControl ("",[Validators.required]),
      fNacimiento: new FormControl("", [Validators.required]),
    });
   }

  ngOnInit() {
    this.listComboCargo();
    this.openSpinner();
  }

  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }


  listComboCargo(){
    this.service.ListarComboCargo().subscribe(
      (result:any)=>{
        this.listComboCargos = result;
        this.listComboArea();
        console.log(result);
      }
    );
  }
  listComboArea(){
    this.service.ListarComboArea().subscribe(
      (result:any)=>{
        this.listComboAreas = result;
        this.dialog.closeAll();
        console.log(result);
      }
    );
  }
  buscarPersonaDNI(e:any){
    let dni = this.formGroupParent.value?.dni;
    this.service.buscarPersonaDNI(dni).subscribe(
      (Result:any)=>{
        if(Result.length > 0){
          this.idPersona = Result[0].idPersona;
          this.formGroupParent.controls.nombres.setValue(Result[0].nombres);
          this.formGroupParent.controls.apellidos.setValue(Result[0].apellidos);
          this.formGroupParent.controls.direccion.setValue(Result[0].direccion);
          this.formGroupParent.controls.ruc.setValue(Result[0].ruc);
        }else{
          this.formGroupParent.controls.nombres.setValue('');
          this.formGroupParent.controls.apellidos.setValue('');
          this.formGroupParent.controls.direccion.setValue('');
          this.formGroupParent.controls.ruc.setValue('');
        }
        console.log(Result);

      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      });
  }
  registrarPersona(){
    this.openSpinner();
    let fechNaci:any = this.pipe.transform(this.formGroupParent.value?.fNacimiento, 'YYYY-MM-dd');
    let param = {
      "dni": this.formGroupParent.value?.dni,
      "apellidos": ""+this.formGroupParent.value?.apellidos,
      "nombres": ""+this.formGroupParent.value?.nombres,
      "ruc": ""+this.formGroupParent.value?.ruc,
      "razonSocial": "",
      "fechNacimiento": ""+fechNaci,
      "direccion": ""+this.formGroupParent.value?.direccion
    }
  console.log("parametros",param);
  this.service.registrarPersona(param).subscribe(
    (result:any)=>{
      if (this.idPersona == 0) {
        this.registrarEmpleados(result.result);
      }else{
        this.registrarEmpleados(this.idPersona);
      }
    },(error:HttpErrorResponse)=>{
      this.dialog.closeAll();
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
    });
}
  registrarEmpleados(e:number){
    let fechIni:any = this.pipe.transform(this.formGroupParent.value?.fechInicioContrato, 'YYYY-MM-dd');
    let fechFin:any = this.pipe.transform(this.formGroupParent.value?.fechFinContrato, 'YYYY-MM-dd');
    let param ={
      "idPersona": e,
      "idArea": this.formGroupParent.value?.asigArea,
      "idCargo": this.formGroupParent.value?.asigCargo,
      "correlativo": ""+this.formGroupParent.value?.numContrato,
      "tdr": this.archivos.tdr,
      "fechaInicio": ""+fechIni,
      "fechafin": ""+fechFin,
      "login": ""+this.formGroupParent.value?.usuario,
      "celular": this.formGroupParent.value?.numCel,
      "correo": ""+this.formGroupParent.value?.correo,
      "descripcion": ""+this.formGroupParent.value?.operador
    }
    this.service.registrarEmpleado(param).subscribe(
      (result:any)=>{
        this.resultadoRegistroEmpleado.next();
        this.dialog.closeAll();
        this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'El empleado se registro correctamente'});
        console.log(result);
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      });
  }
  openDialog(stepper:MatStepper): void {
    this.resultadoRegistroEmpleado = stepper
    this.formGroupParent.markAllAsTouched();
    if(this.formGroupParent.invalid){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de registro'});
      return;
    }
    const dialogRef = this.dialog.open(MConfirmExpedienteComponent, {
      width: '280px',
      data: {name: this.guardar},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Guardar'){
        this.registrarPersona();
         // stepper.next();
      }else{
        return;
      }
      console.log('The dialog was closed',result);
      //this.guardar = result;
    });
  }

  validarUSuario(){
    setTimeout(() => {
        this.service.validarUsuario(this.formGroupParent.controls.usuario.value).subscribe(
          (result:any)=>{
            console.log(result);
            if (result.result != 0) {
              this.formGroupParent['controls'].usuario.setErrors({usuarioEr: true});
            }else{
              this.formGroupParent['controls'].usuario.setErrors(null);
            }
          },(error:HttpErrorResponse)=>{
            this.dialog.closeAll();
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
          });
    }, 1000);
  }

  cargarpdf() {
    const file: File = this.formGroupParent.controls.tdrPDF.value;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log("documento PDF",reader.result);
      this.archivos.tdr = String(reader.result);
    };
  }

  limpiarFormulario(){
    this.formGroupParent.reset();
    for (let name in this.formGroupParent.controls) {
      this.formGroupParent.controls[name].setValue("");
    }
  }
  generarNuevo(stepper:MatStepper){
    this.limpiarFormulario();
    stepper.reset();
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
