import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';
import { MaterialModule } from '../material/material.module';
import { MAsignarExpedienteComponent } from './mAsignarExpediente/mAsignarExpediente.component';
import { MConfirmExpedienteComponent } from './mConfirmExpediente/mConfirmExpediente.component';
import { MActualizarEmpleadoComponent } from './mActualizarEmpleado/mActualizarEmpleado.component';
import { MSpinnerComponent } from './mSpinner/mSpinner.component';
import { MDerivarDetalleComponent } from './mDerivarDetalle/mDerivarDetalle.component';
import { MActualizarContraseñaComponent } from './mActualizarContraseña/mActualizarContraseña.component';

@NgModule({
  declarations: [
    MDerivarDetalleComponent,
    MAsignarExpedienteComponent,
    MConfirmExpedienteComponent,
    MActualizarEmpleadoComponent,
    MSpinnerComponent,
    MActualizarContraseñaComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PrimengModule
  ],
  exports: [
    MAsignarExpedienteComponent,
    MDerivarDetalleComponent
  ],
  providers: [],
})
export class ModalModule {}
