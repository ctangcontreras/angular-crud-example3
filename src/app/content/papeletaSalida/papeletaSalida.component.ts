import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-papeletaSalida',
  templateUrl: './papeletaSalida.component.html',
  styleUrls: ['./papeletaSalida.component.scss']
})
export class PapeletaSalidaComponent implements OnInit {

  formGroupParent: any = [];
  resulListComboMotivo:any = [];
  idInstitucion: number = 0;
  idEmpleado : number = 0;
  pipe = new DatePipe('en-US');
  archivos: any ;
  idRegistro: string = '';
  minDate = new Date();
  //maxDate = new Date(2022,11,12);


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
      motivoSalida: new FormControl('', [Validators.required]),
      fechaSalida: new FormControl('', [Validators.required]),
      horaSalida: new FormControl('', [Validators.required]),
      lugarSalida: new FormControl('', [Validators.required]),
      adjPDF: new FormControl('', [Validators.required]),
      fechaRetorno: new FormControl('', [Validators.required]),
      horaRetorno: new FormControl('', [Validators.required]),
      lugarDestino: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fundamentacion: new FormControl('', [Validators.required]),
      numCorrelativo: new FormControl(''),
      ruc: new FormControl('', [Validators.required]),
      razonSocial: new FormControl({value: '', disabled:true}, [Validators.required]),
    });
  }

  ngOnInit() {
    this.listarComboMotivo();
  }

  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  listarComboMotivo(){
    this.service.listComboMotivo().subscribe(
      (result:any)=>{
        this.resulListComboMotivo = result
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
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      }
    );
  }
  registrarPapeleta(){
    this.formGroupParent.markAllAsTouched();
    if(this.formGroupParent.invalid){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de registro'});
      return;
    }
    this.openSpinner();
    let fechIni:any = this.pipe.transform(this.formGroupParent.value?.fechaSalida, 'YYYY-MM-dd');
    let fechFin:any = this.pipe.transform(this.formGroupParent.value?.fechaRetorno, 'YYYY-MM-dd');
    let param = {
      "lugarSalida": ""+this.formGroupParent.controls.lugarSalida.value,
      "lugarDestino": ""+this.formGroupParent.controls.lugarDestino.value,
      "fundamentacion": ""+this.formGroupParent.controls.fundamentacion.value,
      "descripcionPDF": ""+this.formGroupParent.controls.descripcion.value,
      "pdSustento": ""+this.archivos,
      "idMotivo": this.formGroupParent.controls.motivoSalida.value,
      "idInstitucion": this.idInstitucion,
      "idEmpleado":  this.idEmpleado,
      "fsalida": ""+fechIni +" "+ this.formGroupParent.controls.horaSalida.value+":00",
      "fretorno": ""+fechFin+" "+ this.formGroupParent.controls.horaRetorno.value+":00"
    }
    console.log(param);
    this.service.registrarPapeleta(param).subscribe(
      (result:any)=>{
        this.idRegistro = result.result;
        this.formGroupParent.controls.numCorrelativo.setValue(this.idRegistro);
        this.dialog.closeAll();
        this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'La papeleta se registro correctamente'});
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
