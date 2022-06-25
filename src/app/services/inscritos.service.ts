import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  private options: any = { headers: new HttpHeaders({'Content-Type': 'application/json' })};


  constructor(private http: HttpClient, public toastController: ToastController) { }

  buscarInscrito(busca: string): Observable<IInscritos>{
    const url = `${this.apiURL}${this.edicao}/buscar/${busca}`;

    return this.http.get<IInscritos>(`${this.proxy}${url}`).pipe(
      map(retorno => retorno),
      catchError(erro => this.exibirErro(erro))
    );
  }

  cadastrarInscrito(inscrito: any){
    const url = `${this.apiURL}${this.edicao}`;
    return this.http.post(`${this.proxy}${url}/`, JSON.stringify(inscrito, this.options)).pipe(
      map(retorno => retorno),
      catchError(erro => this.exibirErro(erro))
    );
  }

  atualizarPresenca(inscrito: any, id: number){
    const url = `${this.apiURL}${this.edicao}/${id}`;
    return this.http.put(`${this.proxy}${url}/`, JSON.stringify(inscrito), this.options).pipe(
      map(retorno => retorno),
      catchError(erro => this.exibirErro(erro))
    );
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
