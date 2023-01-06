import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogData } from 'src/app/content/expedienteExterno/expedienteExterno.component';
import { ServiceService } from 'src/app/Service/service.service';
import { MSpinnerComponent } from '../mSpinner/mSpinner.component';

@Component({
  selector: 'app-mAsignarExpediente',
  templateUrl: './mAsignarExpediente.component.html',
  styleUrls: ['./mAsignarExpediente.component.scss']
})
export class MAsignarExpedienteComponent implements OnInit {

  hide = true;
  hide1 = true
  listComboAreas:any = [];
  formGroupParent:any = [];
  resultListExpediente:any =[];
  resultListExp:any =[];
  archivos:any =[];
  idUsuario: number = 0;

  constructor(
    private router: Router,
    private service: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<MAsignarExpedienteComponent>,
    private fb: FormBuilder,
    private messageService: MessageService,
    public dialog: MatDialog,
  ) {
    this.formGroupParent = this.fb.group({
      area: new FormControl('', [Validators.required]),
      docTdr: new FormControl('', [Validators.required]),
      comentario: new FormControl('', [Validators.required]),
    });
   }

  ngOnInit() {
    //this.data.guardar = "Guardar"
    this.listComboArea();
    this.resultListExpediente = this.data;
    this.idUsuario = JSON.parse(String(sessionStorage.getItem('datos'))).idUsuario;
  }

  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  listComboArea(){
    this.service.ListarComboArea().subscribe(
      (result:any)=>{
        this.listComboAreas = result;
        console.log(result);
      }
    );
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

  derivarExp(){
    this.formGroupParent.markAllAsTouched();
    if(this.formGroupParent.invalid){
      return;
    }
    for (let index  of this.resultListExpediente) {
      this.resultListExp = index;
    }
    this.openSpinner();
    let param = {
      "descripcion": ""+this.formGroupParent.controls.comentario.value,
      "idusuario": this.idUsuario,
      "idExpediente": this.resultListExp.name.idExpediente,
      "idArea": this.formGroupParent.controls.area.value,
      "pdfExp": ""+this.archivos.docPdf
    }
    console.log(param);
    this.service.derivarExpediente(param).subscribe(
      (result:any)=>{
        this.dialog.closeAll();
        this.dialogRef.close("Guardado");
        console.log(result);
        this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'El archivo se derivo correctamente'});
      },(error:HttpErrorResponse)=>{
        this.dialog.closeAll();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      });
  }
}
