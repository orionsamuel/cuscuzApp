import { ToastController } from '@ionic/angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ICospobre } from '../models/ICospobre.model';

@Injectable({
  providedIn: 'root'
})
export class CospobreService {

  private edicao = 10;
  private apiURL = 'https://cuscuzhq.herokuapp.com/inscricao/v1/cospobre/';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private options: any = { headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient, public toastController: ToastController) { }

  buscarParticipante(): Observable<any>{
    const url = `${this.apiURL}${this.edicao}/`;
    return this.http.get<any>(`${url}`).pipe(
      map(retorno => retorno),
      catchError(erro => this.exibirErro(erro))
    );
  }

  async exibirErro(erro: any){
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
