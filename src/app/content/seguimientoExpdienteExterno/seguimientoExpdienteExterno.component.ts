import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-seguimientoExpdienteExterno',
  templateUrl: './seguimientoExpdienteExterno.component.html',
  styleUrls: ['./seguimientoExpdienteExterno.component.scss']
})
export class SeguimientoExpdienteExternoComponent implements OnInit {

  busacar = false;
  formGroupParent: any = [];
  resultBusqueda: any = [];
  resultadoDetalle: any = [];
  loading = [false]

  constructor(
    private service: ServiceService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.formGroupParent = this.fb.group({
      numExpediente: new FormControl('',[Validators.required]),
    });
  }

  ngOnInit() {

  }

  buscar(index:any){
    this.formGroupParent.markAllAsTouched();
    if(this.formGroupParent.invalid){
      return;
    }
    this.loading[index] = true;
    this.service.listSeguimientoExpExt(this.formGroupParent.controls.numExpediente.value).subscribe(
      (result:any)=>{
        if(result.length > 0){
          this.loading[index] = false
          this.resultBusqueda = result[0];
          this.resultadoDetalle = result;
          this.busacar = true;
        }else{
          this.loading[index] = false;
          this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Número de expediente no válido'});
        }
        console.log(result);
      }
    );
    //this.busacar = true;
  }
  nuevaConsulta(){
    this.formGroupParent.controls.numExpediente.setValue('');
    this.resultBusqueda = [];
    this.resultadoDetalle = [];
    this.busacar= false;
  }



}
