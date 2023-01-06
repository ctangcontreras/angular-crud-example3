import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  base=environment.url
constructor(
  private http: HttpClient
) { }

//http://localhost:9191/apiPersona/listPersona?dni=12345678
  buscarPersonaDNI(dni:number){
    return this.http.get(this.base + 'apiPersona/listPersona?dni=' + dni);
  }
//http://localhost:9191/apiPersona/insertPersona
  registrarPersona(param:any){
    return this.http.post(`${this.base}apiPersona/insertPersona`,param);
  }
//http://localhost:9191/apiExpediente/insertExpediente
  registrarExpediente(param:any){
    return this.http.post(`${this.base}apiExpediente/insertExpediente`, param);
  }
  //http://localhost:9191/apiEmpleado/insertEmpleado
  registrarEmpleado(param:any){
    return this.http.post(`${this.base}apiEmpleado/insertEmpleado`, param);
  }

  validarUsuario(usuario:string){
    return this.http.get(this.base + 'apiUsuario/listUsuario?usuario=' + usuario);
  }
  //http://localhost:9191/apiCombo/listComboCargo
  ListarComboCargo(){
    return this.http.get(this.base + 'apiCombo/listComboCargo');
  }
  //http://localhost:9191/apiCombo/listComboArea
  ListarComboArea(){
    return this.http.get(this.base + 'apiCombo/listComboArea');
  }
  //http://localhost:9191/apiExpediente/listExpediente
  lisExpediente(param:any){
    return this.http.post(`${this.base}apiExpediente/listExpediente`, param);
  }

  lisEmpleado(param:any){
    return this.http.post(`${this.base}apiEmpleado/listEmpleado`, param);
  }
  //http://localhost:9191/apiExpediente/derivarExpediente
  derivarExpediente(param:any){
    return this.http.post(`${this.base}apiExpediente/derivarExpediente`, param);
  }

  onSeguridad(param:any){
    return this.http.post(`${this.base}apiLogin/listLoginUser`, param);
  }

  lstVerDetalle(param:any){
    return this.http.get(this.base + 'apiExpediente/listVerDetalle?idExpediente='+param);
  }
  //http://localhost:9191/apiEmpleado/actualizarEmpleado
  editarEmpleado(param:any){
    return this.http.post(`${this.base}apiEmpleado/actualizarEmpleado`, param);
  }
  //http://localhost:9191/apiPersona/actualizarPersona
  editarPersona(param:any){
    return this.http.post(`${this.base}apiPersona/actualizarPersona`, param);
  }
  //http://localhost:9191/apiLogin/actualizarContraseña
  editarContraseña(param:any){
    return this.http.post(`${this.base}apiLogin/actualizarContraseña`, param);
  }

  //http://localhost:9191/apiCombo/listComboMotivo
  listComboMotivo(){
    return this.http.get(this.base + 'apiCombo/listComboMotivo');
  }

  //http://localhost:9191/apiCombo/listComboInstitucion
  listComboTema(){
    return this.http.get(this.base + 'apiCombo/listComboTema');
  }

  //http://localhost:9191/apiSalida/insertPapeleta
  registrarPapeleta(param:any){
    return this.http.post(`${this.base}apiSalida/insertPapeleta`, param);
  }
  ///http://localhost:9191/apiSalida/listPapeleta
  listpapeleta(){
    return this.http.get(this.base + 'apiSalida/listPapeleta');
  }
  //http://localhost:9191/apiSalida/insertCapacitacion
  registrarCapacitacion(param:any){
    return this.http.post(`${this.base}apiSalida/insertCapacitacion`, param);
  }
  //http://localhost:9191/apiSalida/listCapacitacion
  listCapacitacion(){
    return this.http.get(this.base + 'apiSalida/listCapacitacion');
  }

 // http://localhost:9191/apiCombo/listInstitucion?ruc=20156598562
  listInstitucion(ruc:string){
    return this.http.get(this.base + 'apiCombo/listInstitucion?ruc='+ruc);
  }

  //http://localhost:9191/apiCombo/listEmpleadoPersona?dni=12345678
  listEmpleadoPersona(dni:Number){
    return this.http.get(this.base + 'apiCombo/listEmpleadoPersona?dni='+dni);
  }

  //http://localhost:9191/apiExpediente/listSeguimientoExpExt?correlativo=0001-2022
  listSeguimientoExpExt(correlativo:String){
    return this.http.get(this.base + 'apiExpediente/listSeguimientoExpExt?correlativo='+correlativo);
  }
  ///http://localhost:9191/apiReporteExp/listReporteExp
  listSeguimientExpPDF(param: any){
    return this.http.post(`${this.base}apiReporteExp/listReporteExp`, param);
  }
}
