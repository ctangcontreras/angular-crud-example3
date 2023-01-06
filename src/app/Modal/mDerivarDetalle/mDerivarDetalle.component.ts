import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogData } from 'src/app/content/expedienteExterno/expedienteExterno.component';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-mDerivarDetalle',
  templateUrl: './mDerivarDetalle.component.html',
  styleUrls: ['./mDerivarDetalle.component.scss']
})
export class MDerivarDetalleComponent implements OnInit {

  hide = true;
  hide1 = true
  formGroupParent:any = [];
  resultListExpediente:any =[];
  resultListExp:any =[];
  dataDetalle:any =[];

  constructor(
    private router: Router,
    private service: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<MDerivarDetalleComponent>,
    private fb: FormBuilder,
  ) {
    this.formGroupParent = this.fb.group({
      area: new FormControl('', [Validators.required]),
      docTdr: new FormControl('', [Validators.required]),
      comentario: new FormControl('', [Validators.required]),
    });
   }

  ngOnInit() {
    //this.data.guardar = "Guardar"
    this.resultListExpediente = this.data;
    this.listComboArea();
  }

  listComboArea(){
    for (let index  of this.resultListExpediente) {
      this.resultListExp = index;
    }

    this.service.lstVerDetalle(this.resultListExp.name.idExpediente).subscribe(
      (result:any)=>{
        this.dataDetalle = result;
        console.log(result);
      }
    );
  }

  cerrar(){
    this.dialogRef.close("Guardado");
  }
}
