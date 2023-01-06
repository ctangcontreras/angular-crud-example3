import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { DownloadFile } from 'src/app/Base/Util';
import { MAsignarExpedienteComponent } from 'src/app/Modal/mAsignarExpediente/mAsignarExpediente.component';
import { MDerivarDetalleComponent } from 'src/app/Modal/mDerivarDetalle/mDerivarDetalle.component';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ServiceService } from 'src/app/Service/service.service';
import { PdfMakeWrapper } from 'pdfmake-wrapper';


export interface listExpediente {
  correlativo: string;
  contenidoExp: string;
  asuntoAnexo: string;
  fechaRegistro: string;
  estado:String;
  pdfExp: string;
  pdfAnexo: String;
  idExpediente:Number;
  idArea: Number;
}
@Component({
  selector: 'app-seguimientoExpediente',
  templateUrl: './seguimientoExpediente.component.html',
  styleUrls: ['./seguimientoExpediente.component.scss']
})

export class SeguimientoExpedienteComponent implements OnInit {

  displayedColumns: string[] = ['correlativo', 'contenidoExp', 'asuntoAnexo', 'fechaRegistro' ,'estado', 'Accion'];
  selectfecha: any = [];
  formGroupParent: any = [];
  ELEMENT_DATA:listExpediente[] = [];
  pipe = new DatePipe('en-US');
  minDate = new Date();
  maxDate = new Date();
  area: string = "";
  idArea: number = 0;

  constructor(
    public dialog: MatDialog,
    public service: ServiceService,
    public fb: FormBuilder,
    private messageService: MessageService,
    ) {
      this.formGroupParent = this.fb.group({
        tipoExpe: new FormControl('',[Validators.required]),
        numExpediente: new FormControl('',[Validators.required]),
        dni: new FormControl('',[Validators.required]),
        fechaIni: new FormControl('',[Validators.required]),
        fechaFin: new FormControl({value:'', disabled:true},[Validators.required]),
      });
    }

  ngOnInit() {
    this.area = JSON.parse(String(sessionStorage.getItem('datos'))).area;
    this.idArea = JSON.parse(String(sessionStorage.getItem('datos'))).idArea;

  }


  resFecha(e:any){
    let f : any;
    this.formGroupParent.controls.fechaFin.enable();
    //console.log(e.getMonth() + 3);
    f = e.getFullYear() +"-"+ (e.getMonth()+3) +"-"+ e.getDate();
    if((new Date(f)) < (new Date())){
      console.log("QUIII FECHA");
      this.maxDate = new Date(f);
    }
  }
  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  generarReportePDF(){
    let fechIni:any = this.pipe.transform(this.formGroupParent.value?.fechaIni, 'YYYY-MM-dd');
    let fechFin:any = this.pipe.transform(this.formGroupParent.value?.fechaFin, 'YYYY-MM-dd');
    let param = {
      "idTipoExp": this.formGroupParent.controls.tipoExpe.value,
      "correlativo": ""+this.formGroupParent.controls.numExpediente.value || "",
      "dni": ""+this.formGroupParent.controls.dni.value || "",
      "fechaInicio": fechIni || null,
      "fechaFin": fechFin || null,
      "area": this.area,
      "idArea": this.idArea
  }
    this.service.listSeguimientExpPDF(param).subscribe(
      (result:any)=>{
        DownloadFile(result.resultado, 'Reporte.pdf', 'application/octet-stream')
        console.log("generarPDF:  ",result);
      }
    );
  }
  listarExpedient(){
    let fechIni:any = this.pipe.transform(this.formGroupParent.value?.fechaIni, 'YYYY-MM-dd');
    let fechFin:any = this.pipe.transform(this.formGroupParent.value?.fechaFin, 'YYYY-MM-dd');
    if(this.formGroupParent.controls.tipoExpe.invalid){
      this.formGroupParent['controls'].tipoExpe.touched = true;
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar parametros de búsqueda'});
      return;
    }
    if(this.formGroupParent.value?.fechaIni != '' && this.formGroupParent.value?.fechaFin == ''){
      this.formGroupParent['controls'].fechaFin.touched = true;
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ingresar la fecha fin'});
      return;
    }
    this.ELEMENT_DATA = [];
    this.openSpinner();
    let param = {
      "idTipoExp": this.formGroupParent.controls.tipoExpe.value,
      "correlativo": ""+this.formGroupParent.controls.numExpediente.value || "",
      "dni": ""+this.formGroupParent.controls.dni.value || "",
      "fechaInicio": fechIni || null,
      "fechaFin": fechFin || null,
      "area": this.area,
      "idArea": this.idArea
    }
    this.service.lisExpediente(param).subscribe(
      (result:any)=>{
        this.formGroupParent['controls'].tipoExpe.touched = false;
        console.log(result);
        this.dialog.closeAll();
        result.forEach((element:any) => {
          this.ELEMENT_DATA.push(
            { correlativo: element.correlativo,
              contenidoExp: element.contenidoExp,
              asuntoAnexo: element.asuntoAnexo,
              fechaRegistro: element.fechaRegistro,
              estado: element.estado,
              pdfExp: String(element.pdfExp),
              pdfAnexo: element.pdfAnexo,
              idExpediente: element.idExpediente,
              idArea:element.idArea}
          );
          console.log("aquiiiii",this.ELEMENT_DATA);
        });
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      });
  }

  limpiar(){
    this.ELEMENT_DATA = [];
    this.formGroupParent.reset();
    for (let name in this.formGroupParent.controls) {
      this.formGroupParent.controls[name].setValue("");
    }
  }

  descargarTDR(param: any) {
    DownloadFile(param.pdfExp, param.correlativo+'_EXP.pdf', 'application/octet-stream')
  }
  descargarAnexo(param: any) {
    DownloadFile(param.pdfAnexo, param.correlativo+'_Anexo.pdf', 'application/octet-stream')
  }

  clic(e:any){
    console.log('holaaaaaaaa', e);
  }



  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, element:any): void {
    const dialogRef = this.dialog.open(MAsignarExpedienteComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true ,
      width: '540px',
      data: [{name:element}],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result=='Guardado'){
        this.listarExpedient();
      }
      //this.guardar = result;
    });
  }

  openDialogDetalle(enterAnimationDuration: string, exitAnimationDuration: string, element:any): void {
    const dialogRef = this.dialog.open(MDerivarDetalleComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true ,
      width: '700px',
      data: [{name:element}],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  validarExpe(event: any){
    const pattern = /[0-9-]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
