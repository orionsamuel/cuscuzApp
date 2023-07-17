import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CospobreService } from '../services/cospobre.service';
import { InscritosService } from './../services/inscritos.service';
import { NotasService } from '../services/notas.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  formCadastroNotas: FormGroup;
  isSubmitted = false;
  edicao: number;
  notas: any = {};
  listaParticipantes: any[];
  listaNotas: any[];
  personagem: string;
  imagem: string;
  nome: string;
  isModalOpen = false;
  musica: HTMLAudioElement;
  posicaoReproducao = 0;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public cospobreService: CospobreService,
    public inscritosService: InscritosService,
    public notasService: NotasService)
    {
      this.buscarEdicao();
      console.log(this.edicao);
      setTimeout(() => {
        this.buscarParticipante();
      }, 2000);
    }

    get errorControl() {
      return this.formCadastroNotas.controls;
    }

    ngOnInit() {
      this.formCadastroNotas = this.formBuilder.group({
        criatividade: ['', [
          Validators.required,
          Validators.pattern(/^10$|^[0-9](\.[0-9]{1,2})?$/),
          Validators.min(0),
          Validators.max(10)
        ]],
        fidelidade: ['', [
          Validators.required,
          Validators.pattern(/^10$|^[0-9](\.[0-9]{1,2})?$/),
          Validators.min(0),
          Validators.max(10)
        ]],
        desenvolvimento: ['', [
          Validators.required,
          Validators.pattern(/^10$|^[0-9](\.[0-9]{1,2})?$/),
          Validators.min(0),
          Validators.max(10)
        ]]
      });
    }

    buscaNotasEAltera()
    {
      this.buscarNotas();

      setTimeout(() => {
        this.cadastroNotas();
      }, 2000);
    }

    cadastroNotas(){
      this.isSubmitted = true;
      if(!this.formCadastroNotas.valid){
        console.log('Formulário inválido');
        this.presentToast('Por favor, preencha as notas corretamente', 'danger');
      }else{
        console.log(this.formCadastroNotas.value);
        this.presentToast('Notas Cadastradas Com Sucesso', 'success');
        const notaEncontrada = this.listaNotas.find((nota) => nota.nome === this.nome);
        console.log(this.nome);
        this.notas.id = notaEncontrada.id;
        this.notas.nome = notaEncontrada.nome;
        this.notas.personagem = notaEncontrada.personagem;
        this.notas.edicao = notaEncontrada.edicao;
        this.notas.nota_1 = notaEncontrada.nota_1 + this.formCadastroNotas.value.criatividade;
        this.notas.nota_2 = notaEncontrada.nota_2 + this.formCadastroNotas.value.fidelidade;
        this.notas.nota_3 = notaEncontrada.nota_3 + this.formCadastroNotas.value.desenvolvimento;
        this.notas.total_nota = (this.notas.nota_1 + this.notas.nota_2+ this.notas.nota_3) / 3;
        console.log(this.notas);
        this.notasService.atualizarNotas(this.notas, this.edicao).subscribe(dados=>{
          console.log(dados);
        });
        this.formCadastroNotas.reset();
      }
    }

    buscarParticipante(){
      this.cospobreService.buscarParticipante(this.edicao).subscribe(dados=>{
        console.log(dados);
        this.listaParticipantes = dados;
      });
    }

    buscarEdicao(){
      this.inscritosService.buscarEdicao().subscribe(dados=>{
        console.log(dados);
        this.edicao = dados.numero;
      });
    }

    buscarNotas(){
      this.notasService.buscarNotas(this.edicao).subscribe(dados=>{
        console.log(dados);
        this.listaNotas = dados;
        console.log(this.listaNotas);
      });
    }

    reproduzirAudio(musicaUrl: string) {
      if (this.musica) {
        this.musica.pause();
      }

      this.musica = new Audio(musicaUrl);
      this.musica.currentTime = this.posicaoReproducao;
      this.musica.play();
    }

    pausarAudio() {
      if (this.musica) {
        this.posicaoReproducao = this.musica.currentTime;
        this.musica.pause();
      }
    }

    pararAudio() {
      if (this.musica) {
        this.musica.pause();
        this.musica.currentTime = 0;
      }
    }

    setModal(isOpen: boolean, personagem: string, imagem: string, nome: string){
      this.isModalOpen = isOpen;
      this.personagem = personagem;
      this.imagem = imagem;
      this.nome = nome;
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
