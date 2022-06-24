import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { InscritosService } from './../services/inscritos.service';
import { IInscritos } from './../models/IInscritos.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  titulo = 'Cadastrar Participante';

  nome: string;
  telefone: string;
  email: string;

  constructor(public toastController: ToastController) {}

  ngOnInit() {
  }

  cadastro(){
    this.presentToast('Cadastrado Com Sucesso', 'success');
  }

  async presentToast(texto: string, cor: string) {
    const toast = await this.toastController.create({
      message: texto,
      color: cor,
      duration: 2000
    });
    toast.present();
  }

}
