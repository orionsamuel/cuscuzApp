import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CospobreService } from '../services/cospobre.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  listaParticipantes: any[];
  personagem: string;
  imagem: string;
  isModalOpen = false;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public route: Router,
    public cospobreService: CospobreService) {this.buscarParticipante();}

    buscarParticipante(){
      this.cospobreService.buscarParticipante().subscribe(dados=>{
        console.log(dados);
        this.listaParticipantes = dados;
      });
    }

    setModal(isOpen: boolean, personagem: string, imagem: string){
      this.isModalOpen = isOpen;
      this.personagem = personagem;
      this.imagem = imagem;
    }
}
