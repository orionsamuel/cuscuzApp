import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
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

  listaInscritos: IInscritos;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public route: Router,
    public inscritosService: InscritosService) {}

    buscarInscrito(evento: any){
      console.log(evento.target.value);

      const busca = evento.target.value;

      if(busca && busca.trim() !== ''){
        this.inscritosService.buscarInscrito(busca).subscribe(dados=>{
          console.log(dados);
          this.listaInscritos = dados;
        });
      }
    }
}
