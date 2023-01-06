import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { DialogData } from 'src/app/content/expedienteExterno/expedienteExterno.component';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-mActualizarContraseña',
  templateUrl: './mActualizarContraseña.component.html',
  styleUrls: ['./mActualizarContraseña.component.scss']
})
export class MActualizarContraseñaComponent implements OnInit {

  hide = true;
  hide1 = true;
  idUsuario: any;
  formGroupParent: any = [];

  constructor(
    private service: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<MActualizarContraseñaComponent>,

  ) {
    this.formGroupParent = this.fb.group({
      contraseña: new FormControl ('', [Validators.required]),
      validContraseña: new FormControl ('', [Validators.required]),
    });
   }

  ngOnInit() {
    this.idUsuario = this.data
    console.log(this.idUsuario.name);
    console.log(this.formGroupParent);
  }

  actualizarContrasenia(){
    console.log(this.formGroupParent);
    if((this.formGroupParent.value?.contraseña == '123456' ) &&  (this.formGroupParent.value?.validContraseña == '123456')){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'La nueva contraseña no devbe ser igual a la contraseña anterior'});
      this.formGroupParent.controls.contraseña.setErrors({required: true});
      this.formGroupParent.controls.validContraseña.setErrors({required: true});
      return;
    }else if(this.formGroupParent.value?.contraseña != this.formGroupParent.value?.validContraseña){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Las contraseñas deben ser iguales'});
      this.formGroupParent.controls.contraseña.setErrors({required: true});
      this.formGroupParent.controls.validContraseña.setErrors({required: true});
      return;
    }else if(this.formGroupParent.value?.contraseña.length < 8 && this.formGroupParent.value?.validContraseña.length < 8 ){
      this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'La contraseña debe tener minimo 8 caracteres'});
      this.formGroupParent.controls.contraseña.setErrors({required: true});
      this.formGroupParent.controls.validContraseña.setErrors({required: true});
      return;
    }
    let param = {
      "idUsuario": this.idUsuario.name,
      "password": ""+this.formGroupParent.controls.validContraseña.value
    }
    this.service.editarContraseña(param).subscribe(
      (result:any)=>{
        if(result.result == 1){
          this.messageService.add({severity:'success', summary: 'Confirmado', detail: 'La contraseña se actualizó correctamente'});
          this.dialogRef.close("Guardado");
          console.log(result);
        }else{
          this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'Ocurrio un error intentelo mas tarde'});
        }

      },(error:HttpErrorResponse)=>{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Revisa tu conexión a internet y vuelve a intentarlo'});
      }
    );
    return;
  }
  validarContra(e:any){
    setTimeout(() => {
      if(this.formGroupParent.value?.contraseña.length >= 8 && this.formGroupParent.value?.validContraseña.length >= 8 && this.formGroupParent.value?.contraseña == this.formGroupParent.value?.validContraseña){
        this.formGroupParent.controls.contraseña.setErrors(null);
        this.formGroupParent.controls.validContraseña.setErrors(null);
        console.log();
      }
      //console.log("aquii...",this.formGroupParent.value?.contraseña.length);

    }, 50);
  }

}
