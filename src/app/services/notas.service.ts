import { ToastController } from '@ionic/angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class NotasService{
    private apiURL;
    private apiURLEdicao = 'https://cuscuz-hq-eacbb89cec6b.herokuapp.com/inscricao/v1/edicaoatual/';
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private options: any = { headers: new HttpHeaders({'Content-Type': 'application/json'})};

    constructor(
    private http: HttpClient,
    public toastController: ToastController){}

    buscarNotas(edicao: number, isCosplay: boolean): Observable<any>{
        console.log(edicao);
        if(isCosplay){
            this.apiURL = 'https://cuscuz-hq-eacbb89cec6b.herokuapp.com/inscricao/v1/cospobre/';
        }else{
            this.apiURL = 'https://cuscuz-hq-eacbb89cec6b.herokuapp.com/inscricao/v1/cosplay/';
        }
        const url = `${this.apiURL}${edicao}/`;
        return this.http.get<any>(`${url}`).pipe(
            map(retorno => retorno),
            catchError(erro => this.exibirErro(erro))
        );
    }

    atualizarNotas(notas: any, edicao: number, isCosplay: boolean){
        if(isCosplay){
            this.apiURL = 'https://cuscuzhq.herokuapp.com/inscricao/v1/cospobre/';
        }else{
            this.apiURL = 'https://cuscuzhq.herokuapp.com/inscricao/v1/cosplay/';
        }
        const url = `${this.apiURL}${edicao}/${notas.id}`;
        return this.http.put(`${url}/`, JSON.stringify(notas), this.options).pipe(
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
