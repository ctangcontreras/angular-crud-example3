import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';
import { MaterialModule } from '../material/material.module';
import { ExpedienteInternoComponent } from './expedienteInterno/expedienteInterno.component';
import { ExpedienteExternoComponent } from './expedienteExterno/expedienteExterno.component';
import { SeguimientoExpedienteComponent } from './seguimientoExpediente/seguimientoExpediente.component';
import { PapeletaSalidaComponent } from './papeletaSalida/papeletaSalida.component';
import { CapacitacionComponent } from './capacitacion/capacitacion.component';
import { RegistrarUsuarioComponent } from './registrarUsuario/registrarUsuario.component';
import { EmpleadoComponent } from './empleados/empleados.component';
import { ReportePapeletaComponent } from './reportePapeleta/reportePapeleta.component';
import { ReporteCapacitacionComponent } from './reporteCapacitacion/reporteCapacitacion.component';
import { SeguimientoExpdienteExternoComponent } from './seguimientoExpdienteExterno/seguimientoExpdienteExterno.component';


@NgModule({
  declarations: [
    ExpedienteInternoComponent,
    ExpedienteExternoComponent,
    SeguimientoExpedienteComponent,
    PapeletaSalidaComponent,
    CapacitacionComponent,
    EmpleadoComponent,
    RegistrarUsuarioComponent,
    ReportePapeletaComponent,
    ReporteCapacitacionComponent,
    SeguimientoExpdienteExternoComponent,

  ],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,

   ],
  exports: [
    ExpedienteInternoComponent
  ],
  providers: [],
})
export class ContentModule {}
