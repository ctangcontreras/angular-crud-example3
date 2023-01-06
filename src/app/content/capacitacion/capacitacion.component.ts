import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-capacitacion',
  templateUrl: './capacitacion.component.html',
  styleUrls: ['./capacitacion.component.scss']
})
export class CapacitacionComponent implements OnInit {

  formGroupParent:any = [];
  resulListComboTema:any = [];
  archivos:any;
  idEmpleado:number=0;
  idInstitucion: number = 0;
  pipe = new DatePipe('en-US');
  idRegistro:string = '';
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private service: ServiceService,
    public dialog: MatDialog,
  ) {
    this.formGroupParent = this.fb.group({
      dni: new FormControl('', [Validators.required]),
      apellidos: new FormControl({value: '', disabled:true}, [Validators.required]),
      nombres: new FormControl({value: '', disabled:true}, [Validators.required]),
      tema: new FormControl('', [Validators.required]),
      ruc: new FormControl('', [Validators.required]),
      razonSocial: new FormControl({value: '', disabled:true}, [Validators.required]),
      fechaSalida: new FormControl('', [Validators.required]),
      horaSalida: new FormControl('', [Validators.required]),
      lugarSalida: new FormControl('', [Validators.required]),
      adjPDF: new FormControl('', [Validators.required]),
      fechaRetorno: new FormControl('', [Validators.required]),
      horaRetorno: new FormControl('', [Validators.required]),
      lugarDestino: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fundamentacion: new FormControl('', [Validators.required]),
      correlativo: new FormControl(''),
    });
   }

  ngOnInit() {
    this.listarComboInstitucion();
  }

  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  buscarInstitucion(e:any){
    let ruc = this.formGroupParent.controls.ruc.value;
    this.openSpinner();
    this.service.listInstitucion(ruc).subscribe(
      (result:any)=>{
        if(result.length > 0){
          this.idInstitucion = result[0].id
          this.formGroupParent.controls.razonSocial.setValue(result[0].nombre);
          this.dialog.closeAll();
        }else{
          this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'La institucion no se encuentra registrada'});
          this.dialog.closeAll();
          return;
        }
        console.log(result);
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      }
    );
  }
  listarComboInstitucion(){
    this.service.listComboTema().subscribe(
      (result:any)=>{
        this.resulListComboTema = result;
      }
    );
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
  buscarPersona(e:any){
    console.log(e);
    let dni = this.formGroupParent.controls.dni.value;
    this.openSpinner();
    this.service.listEmpleadoPersona(dni).subscribe(
      (result:any)=>{
        if(result.length > 0){
          this.idEmpleado = result[0].id
          this.formGroupParent.controls.apellidos.setValue(result[0].apellidos);
          this.formGroupParent.controls.nombres.setValue(result[0].nombres);
          console.log(result);
          this.dialog.closeAll();
        }else{
          this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'El empleado no se encuentra registrado'});
          this.dialog.closeAll();
          return;
        }

      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      });
  }
  registrarCapacitacion(){
    this.formGroupParent.markAllAsTouched();
    if(this.formGroupParent.invalid){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de registro'});
      return;
    }
    this.openSpinner();
    let fechIni:any = this.pipe.transform(this.formGroupParent.value?.fechaSalida, 'YYYY-MM-dd');
    let fechFin:any = this.pipe.transform(this.formGroupParent.value?.fechaRetorno, 'YYYY-MM-dd');
    let param ={
      "fundamentacion": ""+this.formGroupParent.controls.fundamentacion.value,
      "lugarSalida": ""+this.formGroupParent.controls.lugarSalida.value,
      "lugarDestino": ""+this.formGroupParent.controls.lugarDestino.value,
      "descripPDF": ""+this.formGroupParent.controls.descripcion.value,
      "pdfSustento": ""+ this.archivos,
      "idTema": this.formGroupParent.controls.tema.value,
      "idInstitucion": this.idInstitucion,
      "fsalida": ""+fechIni +" "+ this.formGroupParent.controls.horaSalida.value+":00",
      "fretorno": ""+fechFin+" "+ this.formGroupParent.controls.horaRetorno.value+":00"
    }
    this.service.registrarCapacitacion(param).subscribe(
      (result:any)=>{
        this.idRegistro = result.result;
        this.formGroupParent.controls.correlativo.setValue(this.idRegistro);
        this.dialog.closeAll();
        this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'La capacitación se registro correctamente'});
        console.log(result);
        if(this.idRegistro != ''){
          this.formGroupParent.reset();
            for (let name in this.formGroupParent.controls) {
              this.formGroupParent.controls[name].setValue("");
            }
        }
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      }
    );
  }

  cargarpdf(elem: any) {
    const file: File = elem;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log("documento PDF",reader.result);
        this.archivos = String(reader.result);
    };
  }

  limpiarFormulario(){
    this.formGroupParent.reset();
    for (let name in this.formGroupParent.controls) {
      this.formGroupParent.controls[name].setValue("");
    }
  }
}
