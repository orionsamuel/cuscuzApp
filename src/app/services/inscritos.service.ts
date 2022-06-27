import { Platform, ToastController } from '@ionic/angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IInscritos } from '../models/IInscritos.model';

@Injectable({
  providedIn: 'root'
})
export class InscritosService {

  private edicao = 10;
  private apiURL = 'https://cuscuzhq.herokuapp.com/inscricao/v1/participantes/';
  private proxy = 'https://cors-cuscuzhq.herokuapp.com/';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private options: any = { headers: new HttpHeaders({'Content-Type': 'application/json'})};


  constructor(private http: HttpClient, private nativeHttp: HTTP, public toastController: ToastController,
    private platform: Platform) { }

  buscarInscrito(busca: string): Observable<any>{
    if(this.platform.is('cordova')){
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const url = `${this.apiURL}${this.edicao}/buscar/${busca}`;
      const nativeCall = this.nativeHttp.get(url, {}, this.options);
      return from(nativeCall).pipe(
        map(retorno => retorno),
        catchError(erro => this.exibirErro(erro))
      );
    }else{
      const url = `${this.apiURL}${this.edicao}/buscar/${busca}`;
      return this.http.get<any>(`${this.proxy}${url}`).pipe(
        map(retorno => retorno),
        catchError(erro => this.exibirErro(erro))
      );
    }
  }

  cadastrarInscrito(inscrito: any){
    if(this.platform.is('cordova')){
      const url = `${this.apiURL}${this.edicao}`;
      const nativeCall = this.nativeHttp.post(`${url}/`, JSON.stringify(inscrito), this.options);
      return from(nativeCall).pipe(
        map(retorno => retorno),
        catchError(erro => this.exibirErro(erro))
      );
    }else{
      const url = `${this.apiURL}${this.edicao}`;
      return this.http.post(`${this.proxy}${url}/`, JSON.stringify(inscrito), this.options).pipe(
        map(retorno => retorno),
        catchError(erro => this.exibirErro(erro))
      );
    }
  }

  atualizarPresenca(inscrito: any){
    if(this.platform.is('cordova')){
      const url = `${this.apiURL}${this.edicao}`;
      const nativeCall = this.nativeHttp.put(`${url}/`, JSON.stringify(inscrito), this.options);
      return from(nativeCall).pipe(
        map(retorno => retorno),
        catchError(erro => this.exibirErro(erro))
      );
    }else{
      const url = `${this.apiURL}${this.edicao}/${inscrito.id}`;
      return this.http.put(`${this.proxy}${url}/`, JSON.stringify(inscrito), this.options).pipe(
        map(retorno => retorno),
        catchError(erro => this.exibirErro(erro))
      );
    }
  }

  async exibirErro(erro){
    const toast = await this.toastController.create({
      message: 'Erro ao consultar a API',
      duration: 2000,
      color: 'danger',
      position: 'middle'
    });

    toast.present();

    return null;
  }

}
