import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { CospobreService } from '../services/cospobre.service';
import { InscritosService } from './../services/inscritos.service';
import { NotasService } from '../services/notas.service';
import { ImageCacheService } from '../services/image-cache.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  formCadastroNotas: FormGroup;
  isSubmitted = false;
  isCosplay = true;
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
  cachedImages: { [key: string]: string } = {};

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public cospobreService: CospobreService,
    public inscritosService: InscritosService,
    public notasService: NotasService,
    private imageCacheService: ImageCacheService,
    private toastController: ToastController,
    private router: Router,
    private platform: Platform,
    private cdr: ChangeDetectorRef)
    {
      this.platform.ready().then(() => {
        this.init();
      });
      // this.buscarEdicao();
        // console.log(this.edicao);
        // setTimeout(() => {
        //   this.buscarParticipante();
        // }, 2000);
        // console.log(this.isCosplay);
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

    ionViewDidEnter() {
      this.cdr.detectChanges();
    }

    async init() {
      try {
        // Primeiro, busca a edição do evento
        await this.buscarEdicao();

        // Em seguida, busca os participantes (usa a edição do evento)
        await this.buscarParticipante();

        // Agora cacheia as imagens dos participantes
        await this.cacheImagesForParticipants();
      } catch (error) {
        console.error('Erro ao inicializar dados:', error);
      }
    }

    async cacheImagesForParticipants() {
      try {
        for (const participante of this.listaParticipantes) {
          const cachedImageUrl = await this.imageCacheService.cacheImage(participante.imagem, participante.email);
          console.log('URL cache: ', cachedImageUrl);
          //const hash = CryptoJS.MD5(participante.imagem).toString();
          this.cachedImages[participante.email] = cachedImageUrl;
        }
      } catch (error) {
        console.error('Erro ao cacheiar imagens:', error);
      }
    }

    getImageUrl(participante: any): string {
      //const hash = CryptoJS.MD5(participante.imagem).toString();
      console.log('URL final da imagem: ', this.cachedImages[participante.email]);
      const cacheUrl = this.cachedImages[participante.email];
      if(!cacheUrl.includes('null'))
      {
        return cacheUrl;
      }
      return participante.imagem;
    }

    cosplayToggleChanged(event: CustomEvent){
      this.isCosplay = event.detail.checked;
      console.log(this.isCosplay);
      setTimeout(() => {
        this.buscarParticipante();
      }, 2000);
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
        this.notasService.atualizarNotas(this.notas, this.edicao, this.isCosplay).subscribe(dados=>{
          console.log(dados);
        });
        this.formCadastroNotas.reset();
      }
    }

    async buscarParticipante(){
      try {
        const participantes = await this.cospobreService.buscarParticipante(this.edicao, this.isCosplay).toPromise();
        console.log(participantes);
        this.listaParticipantes = participantes;
      } catch (error) {
        console.error('Erro ao buscar participantes:', error);
      }
    }

    async buscarEdicao(){
      try {
        const dados = await this.inscritosService.buscarEdicao().toPromise();
        console.log(dados);
        this.edicao = dados.numero;
      } catch (error) {
        console.error('Erro ao buscar edição:', error);
      }
    }

    buscarNotas(){
      this.notasService.buscarNotas(this.edicao, this.isCosplay).subscribe(dados=>{
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
