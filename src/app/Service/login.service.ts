import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  base=environment.url
constructor(
  private http: HttpClient
) { }

  addCliente(param:any){
    return this.http.post(`${this.base}addCliente`, param);
  }


  clientes(){
    return this.http.get(this.base + 'clientes');
  }


  clienteId(id:number){
    return this.http.get(this.base + 'clienteId/'+id);
  }


  updateCliente(param:any){
    return this.http.post(`${this.base}updateCliente`, param);
  }



  deleteCliente(id:number){
    return this.http.get(this.base + 'deleteCliente/'+id);
  }
}
