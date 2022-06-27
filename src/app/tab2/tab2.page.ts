import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient} from '@angular/common/http';
import { InscritosService } from './../services/inscritos.service';
import { IInscritos } from './../models/IInscritos.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  titulo = 'Cadastrar Participante';

  formCadastro: FormGroup;
  isSubmitted = false;
  inscritos = [];
  inscrito: any = {};

  constructor(public toastController: ToastController,
              private formBuilder: FormBuilder,
              public inscritosService: InscritosService) {}

  get errorControl() {
    return this.formCadastro.controls;
  }

  ngOnInit() {
    this.formCadastro = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      telefone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    });
  }

  cadastro(){
    this.isSubmitted = true;
    if(!this.formCadastro.valid){
      console.log('Formulário inválido');
      this.presentToast('Por favor, preencha o formulário corretamente', 'danger');
    }else{
      console.log(this.formCadastro.value);
      this.presentToast('Cadastrado Com Sucesso', 'success');
      this.inscrito.nome = this.formCadastro.value.nome;
      this.inscrito.telefone = this.formCadastro.value.telefone;
      this.inscrito.email = this.formCadastro.value.email;
      this.inscrito.edicao = 1;
      this.inscrito.presente = true;
      this.inscrito.sorteado = false;
      console.log(this.inscrito);
      this.inscritosService.cadastrarInscrito(this.inscrito).subscribe(dados=>{
        console.log(dados);
      });
      this.formCadastro.reset();
    }
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
