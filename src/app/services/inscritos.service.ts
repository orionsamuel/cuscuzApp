import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IInscritos } from '../models/IInscritos.model';

@Injectable({
  providedIn: 'root'
})
export class InscritosService {

  private apiURL = 'https://cuscuzhq.herokuapp.com/inscricao/v1/participantes/10/';

  constructor(private http: HttpClient, public toastController: ToastController) { }

  buscarInscrito(busca: string): Observable<IInscritos>{
    const url = `${this.apiURL}buscar/${busca}`;

    return this.http.get<IInscritos>(url).pipe(
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
