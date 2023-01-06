import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from './Base/login/login.component';
import { CapacitacionComponent } from './content/capacitacion/capacitacion.component';
import { ExpedienteExternoComponent } from './content/expedienteExterno/expedienteExterno.component';
import { ExpedienteInternoComponent } from './content/expedienteInterno/expedienteInterno.component';
import { PapeletaSalidaComponent } from './content/papeletaSalida/papeletaSalida.component';
import { SeguimientoExpedienteComponent } from './content/seguimientoExpediente/seguimientoExpediente.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavsComponent } from './navs/navs.component';
import { RegistrarUsuarioComponent } from './content/registrarUsuario/registrarUsuario.component';
import { EmpleadoComponent } from './content/empleados/empleados.component';
import { ReportePapeletaComponent } from './content/reportePapeleta/reportePapeleta.component';
import { ReporteCapacitacionComponent } from './content/reporteCapacitacion/reporteCapacitacion.component';
import { SeguimientoExpdienteExternoComponent } from './content/seguimientoExpdienteExterno/seguimientoExpdienteExterno.component';

const routes: Routes = [
  {
    path: '',
    component: loginComponent,
  },
  {
    path: 'expedienteExterno',
    component: ExpedienteExternoComponent
  },
  {
    path: 'seguimientoExpExt',
    component: SeguimientoExpdienteExternoComponent
  },
  {
  path: 'main',
  component: NavsComponent,

  children: [
    {
      path: 'navs',
      loadChildren: () =>
        import('./navs/navs.module').then((m) => m.NavsModule)
    },
        {
          path: 'navs/expedienteInterno',
          component: ExpedienteInternoComponent
      },
      {
        path: 'navs/seguimientoExpediente',
        component: SeguimientoExpedienteComponent
      },
        {
          path: 'navs/papeletaSalida',
          component: PapeletaSalidaComponent
        },
        {
          path: 'navs/capacitacion',
          component: CapacitacionComponent
        },
        {
          path: 'navs/reportePapeleta',
          component: ReportePapeletaComponent,
        },
        {
          path: 'navs/registrarUsuario',
          component: RegistrarUsuarioComponent
        },{
          path: 'navs/empleado',
          component: EmpleadoComponent
        },
        {
          path: 'navs/reporteCapacitacion',
          component: ReporteCapacitacionComponent
        },


    //{path: '**', redirectTo: 'login'}

  ],
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
