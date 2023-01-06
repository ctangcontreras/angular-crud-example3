import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MessageService } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';
import { MConfirmExpedienteComponent } from 'src/app/Modal/mConfirmExpediente/mConfirmExpediente.component';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ServiceService } from 'src/app/Service/service.service';

export interface DialogData {
  guardar: string;
}

@Component({
  selector: 'app-expedienteExterno',
  templateUrl: './expedienteExterno.component.html',
  styleUrls: ['./expedienteExterno.component.scss']
})
export class ExpedienteExternoComponent implements OnInit {

  formGroupParent:any = [];
  ocultarInputruc: boolean = true;
  ocultarInputCarnetExt: boolean = true;
  tipoDocumentoIdentidad: any;
  correlativo: any;
  date = new Date();
  idPersona: number = 0;
  guardar: string = '';
  files?: Array<File>;
  archivos:any = [];
  isEditable = false;
  stepperN:any;
  urlRef: String = '';

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    public dialog: MatDialog,
    private messageService: MessageService,
    ) {
    this.formGroupParent = this.fb.group({
      datosUsuario: this.fb.array([]),
      agregarAnexo: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.urlRef =  window.location.origin +'/'+'#/seguimientoExpExt';
    console.log('this.urlRef',this.urlRef);
    console.log("fechaActual",this.date);
    (this.formGroupParent.controls.agregarAnexo as FormArray).push(
      this.fb.group({
        tipoDoc: ['', Validators.required],
        numDoc: ['', Validators.required],
        asunto: ['', Validators.required],
        numFolios: ['', Validators.required],
        docPdf: ['', Validators.required],
        anexo1: ['', Validators.required],
        descripcionAnexo: ['', Validators.required],
      }));
    (this.formGroupParent.controls.datosUsuario as FormArray).push(
      this.fb.group({
        tipoDocumento: ['', Validators.required],
        dni: [{ value: '', disabled: true}, Validators.required],
        RUC: [{ value: '', disabled: true}, Validators.required],
        apellidos: [{ value: '', disabled: true}, Validators.required],
        nombres: [{ value: '', disabled: true}, Validators.required],
        direccion: [{ value: '', disabled: true}, Validators.required],
        correo: [{ value: '', disabled: true}, [Validators.email, Validators.required]],
        numCelular: [{ value: '', disabled: true}, Validators.required],
        operador: [{ value: '', disabled: true}, Validators.required],
        carnetExtrangeria:[{ value: '', disabled: true}, Validators.required],
        razonSocial: [{ value: '', disabled: true}, Validators.required],
      }));
  }
  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  selectComboTipoDoc(e:any){
    this.tipoDocumentoIdentidad = e.value
    if(e.value == 'RUC'){
      this.ocultarInputruc = false;
      this.ocultarInputCarnetExt = true;
      (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
        console.log(element);
        element.get('dni').enable();
        element.controls.carnetExtrangeria.setValue("");
        element.controls.carnetExtrangeria.setErrors(null);

        element.controls.dni.setValue("");
        element.controls.RUC.setValue("");
        element.controls.apellidos.setValue("");
        element.controls.nombres.setValue("");
        element.controls.direccion.setValue("");
        element.controls.correo.setValue("");
        element.controls.numCelular.setValue("");
        element.controls.operador.setValue("");
        element.controls.carnetExtrangeria.setValue("");
        element.controls.razonSocial.setValue("");

        element.get('carnetExtrangeria').disable();
        element.get('apellidos').disable();
        element.get('nombres').disable();
        element.get('direccion').disable();
        element.get('razonSocial').disable();
        element.get('RUC').disable();
      });
    }else if (e.value == 'DNI'){
      this.ocultarInputruc = true;
      this.ocultarInputCarnetExt = true;
      (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
        element.controls.RUC.setValue("");
        element.controls.razonSocial.setValue("");
        element.controls.carnetExtrangeria.setValue("");
        element.controls.RUC.setErrors(null);
        element.controls.razonSocial.setErrors(null);
        element.controls.carnetExtrangeria.setErrors(null);

        element.controls.dni.setValue("");
        element.controls.RUC.setValue("");
        element.controls.apellidos.setValue("");
        element.controls.nombres.setValue("");
        element.controls.direccion.setValue("");
        element.controls.correo.setValue("");
        element.controls.numCelular.setValue("");
        element.controls.operador.setValue("");
        element.controls.carnetExtrangeria.setValue("");
        element.controls.razonSocial.setValue("");

        element.get('dni').enable();

        element.get('carnetExtrangeria').disable();
        element.get('apellidos').disable();
        element.get('nombres').disable();
        element.get('direccion').disable();
      });
    }else{
      this.ocultarInputCarnetExt = false;
      this.ocultarInputruc = true;
      (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
        element.controls.RUC.setValue("");
        element.controls.razonSocial.setValue("");
        element.controls.carnetExtrangeria.setValue("");
        element.controls.dni.setValue("");
        element.controls.RUC.setErrors(null);
        element.controls.razonSocial.setErrors(null);
        element.controls.carnetExtrangeria.setErrors(null);
        element.controls.dni.setErrors(null);

        element.controls.dni.setValue("");
        element.controls.RUC.setValue("");
        element.controls.apellidos.setValue("");
        element.controls.nombres.setValue("");
        element.controls.direccion.setValue("");
        element.controls.correo.setValue("");
        element.controls.numCelular.setValue("");
        element.controls.operador.setValue("");
        element.controls.carnetExtrangeria.setValue("");
        element.controls.razonSocial.setValue("");

        element.get('carnetExtrangeria').enable();
        element.get('apellidos').enable();
        element.get('nombres').enable();
        element.get('direccion').enable();
        element.get('correo').enable();
        element.get('numCelular').enable();
        element.get('operador').enable();
      });
    }

  }

  buscarPersona(evt: any){
    let dni: number = 0;
    this.openSpinner();
    (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
      dni = element.controls.dni.value;
      this.service.buscarPersonaDNI(dni).subscribe(
        (result:any)=>{
          this.dialog.closeAll();
          if(result.length > 0){
            this.idPersona = result[0].idPersona
            element.controls.apellidos.setValue(result[0].apellidos);
            element.controls.nombres.setValue(result[0].nombres);
            element.controls.direccion.setValue(result[0].direccion);
            element.controls.razonSocial.setValue(result[0].razonSocial);
            element.controls.RUC.setValue(result[0].ruc);
            element.get('correo').enable();
            element.get('numCelular').enable();
            element.get('operador').enable();

            element.get('RUC').disable();
            element.get('razonSocial').disable();
            element.get('carnetExtrangeria').disable();
            element.get('apellidos').disable();
            element.get('nombres').disable();
            element.get('direccion').disable();
          }else{
            if(this.tipoDocumentoIdentidad == 'RUC'){
              element.controls.RUC.setValue("");
              element.controls.apellidos.setValue("");
              element.controls.nombres.setValue("");
              element.controls.direccion.setValue("");
              element.controls.correo.setValue("");
              element.controls.numCelular.setValue("");
              element.controls.operador.setValue("");
              element.controls.carnetExtrangeria.setValue("");
              element.controls.razonSocial.setValue("");

              element.get('razonSocial').enable();
              element.get('RUC').enable();
              element.get('apellidos').enable();
              element.get('nombres').enable();
              element.get('direccion').enable();
              element.get('correo').enable();
              element.get('numCelular').enable();
              element.get('operador').enable();
              return;
            }else if (this.tipoDocumentoIdentidad == 'DNI'){
              element.controls.RUC.setValue("");
              element.controls.apellidos.setValue("");
              element.controls.nombres.setValue("");
              element.controls.direccion.setValue("");
              element.controls.correo.setValue("");
              element.controls.numCelular.setValue("");
              element.controls.operador.setValue("");
              element.controls.carnetExtrangeria.setValue("");
              element.controls.razonSocial.setValue("");

              element.get('apellidos').enable();
              element.get('nombres').enable();
              element.get('direccion').enable();
              element.get('correo').enable();
              element.get('numCelular').enable();
              element.get('operador').enable();
              return;
            }else{
              element.controls.RUC.setValue("");
              element.controls.apellidos.setValue("");
              element.controls.nombres.setValue("");
              element.controls.direccion.setValue("");
              element.controls.correo.setValue("");
              element.controls.numCelular.setValue("");
              element.controls.operador.setValue("");
              element.controls.carnetExtrangeria.setValue("");
              element.controls.razonSocial.setValue("");

              element.get('apellidos').enable();
              element.get('nombres').enable();
              element.get('direccion').enable();
              element.get('correo').enable();
              element.get('numCelular').enable();
              element.get('operador').enable();
              element.get('carnetExtrangeria').enable();
              return;
            }
          }
          console.log("result",result);
        },(error:HttpErrorResponse)=>{
          this.dialog.closeAll();
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
        });
    });
  }
  registrarPersona(){
    (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
      console.log("element",element.get('nombres').value);
      let param = {
        "dni": element.get('dni').value,
        "apellidos": ""+element.get('apellidos').value,
        "nombres": ""+element.get('nombres').value,
        "ruc": ""+element.get('RUC').value,
        "razonSocial": ""+element.get('razonSocial').value,
        "direccion": ""+element.get('direccion').value
      }
      console.log("parametros",param);
      this.service.registrarPersona(param).subscribe(
      (result:any)=>{
        console.log("aquiiii",result.result);
        if(result.result != 0 || result.result == 0){
          console.log("aquiiii",result.result);
          this.registrarExpediente(element.get('tipoDocumento').value,element.get('carnetExtrangeria').value,element.get('correo').value,element.get('numCelular').value,element.get('operador').value,result.result);
        }

      });
    });
  }
  registrarExpediente(tipoDocIndentidad:any,carnetExtran:any,correo:any,numCel:any,operador:any,idPersona:any){
    (this.formGroupParent.get('agregarAnexo')['controls']).forEach((element:any) => {
      console.log(element.controls);
      let param = {
        "tipo": ""+tipoDocIndentidad,
        "asuntoExp": ""+element.value?.asunto,
        "contenidoExp": element.value?.tipoDoc,
        "descripcionPdf": ""+element.value?.numDoc,
        "pdfExp": ""+ this.archivos.docPdf,
        "folio": element.value?.numFolios,
        "descripcionAnexo": ""+element.value?.descripcionAnexo,
        "pdfAnexo": ""+this.archivos.anexo,
        "idUsuario": null,
        "idEstadoExp": 1,
        "idTipoExp": 2,
        "idPersona": idPersona || this.idPersona,
        "carnetExt": carnetExtran || 0,
        "celular": numCel,
        "correo": ""+correo,
        "descripcion": ""+operador
      }
      this.openSpinner();
      console.log("aquiiiiiii.....",param);
      this.service.registrarExpediente(param).subscribe(
        (result:any)=>{
          this.correlativo=result.result;
          this.dialog.closeAll();
          this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'El expediente se registro correctamente'});
          console.log("resultadoExpedienteExperno",result);
          this.stepperN.next();
        },(error:HttpErrorResponse)=>{
          this.dialog.closeAll();
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
        });
    });
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
      data: {name: this.guardar},
      disableClose: true ,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Guardar'){
        this.registrarPersona();
        //this.guardarExpediente();
        //stepper.next();
      }else{
        return;
      }
      console.log('The dialog was closed',result);
      //this.guardar = result;
    });
  }

  cargarpdf(elem: any, item: number) {
    const file: File = elem;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (item == 1) {
        this.archivos.docPdf = String(reader.result);
      }
      if (item == 2) {
        this.archivos.anexo = String(reader.result);
      }
    };
  }
  generarNuevo(stepper:any){
    (this.formGroupParent.get('datosUsuario')['controls']).forEach((element:any) => {
      stepper.reset();
      element.controls.tipoDocumento.setValue("DNI");
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
    })

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
