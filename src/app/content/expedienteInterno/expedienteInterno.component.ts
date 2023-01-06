import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MConfirmExpedienteComponent } from 'src/app/Modal/mConfirmExpediente/mConfirmExpediente.component';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ModalPruebaComponent } from 'src/app/modalPrueba/modalPrueba.component';
import { ServiceService } from 'src/app/Service/service.service';

export interface DialogData {
  guardar: string;
}


@Component({
  selector: 'app-expedienteInterno',
  templateUrl: './expedienteInterno.component.html',
  styleUrls: ['./expedienteInterno.component.scss']
})
export class ExpedienteInternoComponent implements OnInit {

  formGroupParent: any = [];
  isEditable = false;
  datosPersona: any = [];
  ocultarRucRasonSocial: boolean = true;
  archivos:any = [];
  guardar:any;
  numExpediente:string = '';
  date: Date = new Date();
  idUsuario:number=0;
  stepperN:any;

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public dialog: MatDialog,
    private router: Router,
    private prueba: ServiceService,
    private _formBuilder: FormBuilder,
    private fb: FormBuilder,
    private service: ServiceService,

    ) {
      this.formGroupParent = this.fb.group({
        agregarAnexo: this.fb.array([]),
        datosUsuario: this.fb.array([]),
      });
     }

  ngOnInit() {
    this.idUsuario = JSON.parse(String(sessionStorage.getItem('datos'))).idUsuario;
    (this.formGroupParent.controls.datosUsuario as FormArray).push(
      this.fb.group({
        dni: ['', Validators.required],
        ruc: [{ value: '', disabled: true}],
        apellidos: [{ value: '', disabled: true}, Validators.required],
        nombres: [{ value: '', disabled: true}, Validators.required],
      }));
    (this.formGroupParent.controls.agregarAnexo as FormArray).push(
      this.fb.group({
        tipoDoc: ['', Validators.required],
        numDocu: ['', Validators.required],
        asunto: ['', Validators.required],
        numFolios: ['', Validators.required],
        docPdf: ['', Validators.required],
        descAnexo: ['', Validators.required],
        docPdfAnexo: ['', Validators.required],
      }));
  }
  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  selectComboTipoDoc(e:any){
    if(e.value == 'DNI'){
      (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
        element.controls.dni.enable();
      });
    }else if(e.value == 'RUC'){
      (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
        element.controls.dni.enable();
      });
    }
  }
  buscarPersona(e:any){
    let dni: number = 0;
    (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
      dni = element.controls.dni.value;
      this.service.buscarPersonaDNI(dni).subscribe(
        (result:any)=>{
          if(result.length > 0){
            this.datosPersona = result;
            element.controls.ruc.setValue(result[0].ruc);
            element.controls.apellidos.setValue(result[0].apellidos);
            element.controls.nombres.setValue(result[0].nombres);

            element.controls.ruc.disable()
            element.controls.apellidos.disable();
            element.controls.nombres.disable();
            if(result[0].ruc != ''){
              element.controls.ruc.disable();
            }else{
              element.controls.ruc.enable();
            }

          }else{
            element.controls.ruc.setValue("");
            element.controls.apellidos.setValue("");
            element.controls.nombres.setValue("");

            element.controls.ruc.enable();
            element.controls.apellidos.enable();
            element.controls.nombres.enable();
          }
        });
    });
  }
  cargarpdf(elem: any, item: number) {
    const file: File = elem;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (item == 1) {
        console.log("documento PDF",reader.result);
        this.archivos.docPdf = String(reader.result);
      }
      if (item == 2) {
        console.log("documento anexo",reader.result);
        this.archivos.anexo = String(reader.result);
      }
    };
  }

  openDialog(stepper:MatStepper): void {
    this.stepperN = stepper;
    this.formGroupParent.controls.agregarAnexo.markAllAsTouched();
    if(this.formGroupParent.controls.agregarAnexo.invalid){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de registro'});
      return;
    }
    const dialogRef = this.dialog.open(MConfirmExpedienteComponent, {
      width: '280px',
      disableClose: true ,
      data: {name: this.guardar},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Guardar'){
        this.registrarExpedienteInterno();
      }else{
        return;
      }
      console.log('The dialog was closed',result);
      //this.guardar = result;
    });
  }
  registrarExpedienteInterno(){
    (this.formGroupParent.get('agregarAnexo')['controls']).forEach((element:any) => {
      let param ={
        "tipo": "",
        "asuntoExp": ""+element.value?.asunto,
        "contenidoExp": element.value?.tipoDoc,
        "descripcionPdf": ""+element.value?.numDocu,
        "pdfExp": ""+this.archivos.docPdf,
        "folio": element.value?.numFolios,
        "descripcionAnexo": ""+element.value?.descAnexo,
        "pdfAnexo": ""+this.archivos.anexo,
        "idUsuario": this.idUsuario,//observacion
        "idEstadoExp": 1,
        "idTipoExp": 1,
        "idPersona": null,
        "carnetExt": null,
        "celular": null,//observacion
        "correo": "",//observacion
        "descripcion": ""//observacion
      }
      this.openSpinner();
      console.log(param);
      this.service.registrarExpediente(param).subscribe(
        (result:any)=>{
          this.numExpediente = result.result
          this.dialog.closeAll();
          this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'El expediente se registro correctamente'});
          this.stepperN.next();
          console.log("correlativos",result);
        },(error:HttpErrorResponse)=>{
          this.dialog.closeAll();
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
        });
    });
  }
  regresarRegistroPersona(stepper:any){
    this.isEditable = true;
    setTimeout(() => {
      stepper.previous();
    }, 10);
  }
  SiguienteVentana(stepper:any){
    this.formGroupParent.controls.datosUsuario.markAllAsTouched();
    if(this.formGroupParent.controls.datosUsuario.invalid){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de registro'});
      return;
    }
    (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
      if( element.get('nombres').value == ''){
        console.log("9562",element.get('nombres').value);
        this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de registro'});
        return;
      }else{
        this.isEditable = false;
        stepper.next();
      }
    });
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
