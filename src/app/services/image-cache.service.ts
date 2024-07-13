import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {

  constructor(private file: File, private http: HttpClient, private platform: Platform) { }

  public async cacheImage(url: string, emailParticipante: string): Promise<string> {
    await this.platform.ready();

    const filePath = this.getFilePath(emailParticipante);

    console.log('Cache Image - File Path:', filePath);

    try {
      // Verifica se o arquivo já está em cache
      await this.file.checkFile(this.file.dataDirectory, filePath);
      console.log('File is already cached:', this.file.dataDirectory,filePath);
      return this.file.dataDirectory + filePath;
    } catch (e) {
      // Arquivo não está em cache, baixa e armazena
      const response = await this.http.get(url, { responseType: 'blob' }).toPromise();
      await this.file.writeFile(this.file.dataDirectory, filePath, response, { replace: true });
      console.log('File downloaded and cached:', this.file.dataDirectory + filePath);
      return this.file.dataDirectory + filePath;
    }
  }

  private getFilePath(emailParticipante: string): string {
    //const hash = CryptoJS.MD5(url).toString();
    return emailParticipante + '.jpg';
  }

}
