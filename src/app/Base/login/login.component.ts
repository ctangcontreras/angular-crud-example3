import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/Service/login.service';
import { ServiceService } from 'src/app/Service/service.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class loginComponent implements OnInit {

  formGroupParent:any = [];
  hide = true;

  displayedColumns: string[] = ['nombres', 'apeMat', 'apePat', 'fechaNac', 'sexo', 'direccion', 'correo'];

  dataSource : any[] = [];



  constructor(private messageService: MessageService,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private service: ServiceService,
    private loginService: LoginService,
) {

  this.formGroupParent = this.fb.group({

    id: new FormControl (""),
    nombre: new FormControl ("",[Validators.required]),
    apellidoPaterno: new FormControl ("",[Validators.required]),
    apellidoMaterno: new FormControl("",[Validators.required]),
    fechaNacimiento: new FormControl("",[Validators.required]),
    direccion: new FormControl("",[Validators.required]),
    correo: new FormControl("",[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$") ]),
    sexo: new FormControl("",[Validators.required])
  });

}

  ngOnInit() {

    this.listar();
  }


  ngAfterViewInit() {

  }



  clickGetId(x:any){

    console.log(x);
    this.getId(x.id);
  }


  clickEliminar(){

    if (!this.formGroupParent.value.id) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Seleccione un registro'});
      return
    }

    this.eliminar(this.formGroupParent.value.id);
  }

  clickRegistrar(){

    if(this.formGroupParent.invalid){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ingrese los datos'});
      return
    }

    this.formGroupParent.controls['id'].setValue(null);



    this.registrar(this.formGroupParent.value);

  }


  clickActualizar(){

    if(this.formGroupParent.invalid){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Ingrese los datos'});
      return
    }

    if (!this.formGroupParent.value.id) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Seleccione un registro'});
      return
    }

    this.actualizar(this.formGroupParent.value);
  }


  private listar(){

    this.loginService.clientes().subscribe((result: any) => {

      console.log("x",result);

      this.dataSource = result;

    }, (error: HttpErrorResponse) => {
    }
    );
  }



  private registrar(x:any){

    this.loginService.addCliente(x).subscribe((result: any) => {

      this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'Se registró correctamente'});
      this.formGroupParent.reset();
       this.listar();

    }, (error: HttpErrorResponse) => {
    }
    );
  }


  private actualizar(x:any){

    this.loginService.updateCliente(x).subscribe((result: any) => {

      this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'Se registró correctamente'});
      this.formGroupParent.reset();
       this.listar();

    }, (error: HttpErrorResponse) => {
    }
    );
  }

  private eliminar(x:number){

    this.loginService.deleteCliente(x).subscribe((result: any) => {

      this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'Se eliminó correctamente'});
      this.formGroupParent.reset();
       this.listar();

    }, (error: HttpErrorResponse) => {
      console.log("x",error);
    }
    );
  }


  private getId(x:number){

    this.loginService.clienteId(x).subscribe((result: any) => {


      console.log("x",result);

      this.formGroupParent.reset();
      this.formGroupParent.controls['nombre'].setValue(result.nombre);
      this.formGroupParent.controls['apellidoPaterno'].setValue(result.apellidoPaterno);
      this.formGroupParent.controls['apellidoMaterno'].setValue(result.apellidoMaterno);
      this.formGroupParent.controls['correo'].setValue(result.correo);
      this.formGroupParent.controls['direccion'].setValue(result.direccion);
      this.formGroupParent.controls['fechaNacimiento'].setValue(new Date(result.fechaNacimiento));
      this.formGroupParent.controls['sexo'].setValue(""+result.sexo);
      this.formGroupParent.controls['id'].setValue(result.id);





    }, (error: HttpErrorResponse) => {
    }
    );
  }




  keyPress2(event: any) {
    const pattern = /[@áéíóúÁÉÍÓÚa-zA-ZñÑ \+\\]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
