import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { InscritosService } from './../services/inscritos.service';
import { IInscritos } from './../models/IInscritos.model';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  titulo = 'Inscritos Cuscuz HQ';

  edicao: number;
  listaInscritos: any[];
  presente: boolean;
  mensagem: string;
  tamanho: number;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public route: Router,
    public inscritosService: InscritosService)
    {
      this.inscritosService.buscarEdicao().subscribe(dados=>{
        console.log(dados);
        this.edicao = dados.numero;
      });
    }

    buscarInscrito(evento: any){
      console.log(this.edicao);
      console.log(evento.target.value);
      const busca = evento.target.value;
      if(busca && busca.trim() !== ''){
        this.inscritosService.buscarInscrito(busca).subscribe(dados=>{
          console.log(dados);
          this.listaInscritos = dados;
          this.tamanho = dados.length;
        });
      }
    }

    alterarPresenca1(inscrito: any){
      inscrito.presente1 = inscrito.presente1;
      console.log(inscrito);
      this.inscritosService.atualizarPresenca(inscrito).subscribe(dados=>{
        console.log(dados);
        console.log(this.listaInscritos);
      });
    }

    alterarPresenca2(inscrito: any){
      inscrito.presente2 = inscrito.presente2;
      console.log(inscrito);
      this.inscritosService.atualizarPresenca(inscrito).subscribe(dados=>{
        console.log(dados);
        console.log(this.listaInscritos);
      });
    }

    async exibirAlertaPresenca1(inscrito: any) {
      if(!inscrito.presente1){
        this.mensagem = 'Deseja colocar participante como ausente?';
      }else{
        this.mensagem = 'Deseja colocar participante como presente?';
      }
      const alert = await this.alertController.create({
        header: null,
        message: this.mensagem,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            id: 'cancel-button',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              if(this.presente){}
              this.presente = !this.presente;
            }
          }, {
            text: 'SIM, Alterar Presença',
            id: 'confirm-button',
            handler: () => {
              this.apresentarToast1(inscrito);
            }
          }
        ]
      });

      await alert.present();
    }

    async exibirAlertaPresenca2(inscrito: any) {
      if(!inscrito.presente2){
        this.mensagem = 'Deseja colocar participante como ausente?';
      }else{
        this.mensagem = 'Deseja colocar participante como presente?';
      }
      const alert = await this.alertController.create({
        header: null,
        message: this.mensagem,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            id: 'cancel-button',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              if(this.presente){}
              this.presente = !this.presente;
            }
          }, {
            text: 'SIM, Alterar Presença',
            id: 'confirm-button',
            handler: () => {
              this.apresentarToast2(inscrito);
            }
          }
        ]
      });

      await alert.present();
    }

    async apresentarToast1(inscrito: any) {
      const toast = await this.toastController.create({
        message: 'Alterada a presença do participante.',
        duration: 2000,
        color: 'success '
      });
      toast.present();
      this.alterarPresenca1(inscrito);
    }

    async apresentarToast2(inscrito: any) {
      const toast = await this.toastController.create({
        message: 'Alterada a presença do participante.',
        duration: 2000,
        color: 'success '
      });
      toast.present();
      this.alterarPresenca2(inscrito);
    }
}
