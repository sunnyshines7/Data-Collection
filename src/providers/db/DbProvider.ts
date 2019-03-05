import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { FileUploadOptions, FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  headers: Headers;
  baseurl: string = "";
  server_url: string = "";

  constructor(public http: Http, public transfer: FileTransfer, public alertCtrl: AlertController) {
    this.headers = new Headers();
    this.headers.append('X-Parse-Application-Id', "AGdJfMjQmSpVsXuZx4z6C9EbGeKgNjRnTqVtYv2y");
    this.headers.append('X-Parse-REST-API-Key', "kRnTqWtYv3y5A7DaFcHfMhPkSpUrXuZw3z6B8DbG");
    this.headers.append('X-Parse-MASTER-Key', "MjQmSqVsXu2x4z6C9EbGeKgNkRnTqWtYv2y5A7Ca");
    this.headers.append('Content-Type', "application/json");

    // this.server_url = 'http://192.168.0.115:8081/';
    this.server_url = 'http://trac.telangana.gov.in:8081/';
    
    this.baseurl = this.server_url +'parse/';
    // this.baseurl = "http://localhost:8081/parse/";
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("current_user"));
  }

  setCurrentUser(data) {
    localStorage.setItem("current_user", JSON.stringify(data));
  }

  getUser(id) {
    return this.http.get(this.baseurl + "users/" + id + "?include=directory", {headers: this.headers})
      .map((resp: Response) => {
        return resp.json();
      })
      .do((data: any) => {
        return data;
      })
  }

  signIn(user_name, password) {
    return this.http.get(this.baseurl + 'login?username=' + user_name + '&password=' + password, {headers: this.headers})
      .map((resp: Response) => {
        return resp.json();
      })
      .do((data: any) => {
        return data;
      });
  }

  getDirectory(district, state, mandal) {
    var obj = {
      "district_name": district,
      "state_name": state,
      "mandal": mandal
    }
    return this.http.get(this.baseurl + 'classes/Directory?where=' + JSON.stringify(obj), {headers: this.headers})
      .map((resp: Response) => {
        return resp.json();
      })
      .do((data: any) => {
        return data;
      });
  }

  saveWaterSchedule(data) {
    return this.http.post(this.baseurl + 'classes/WaterBodySchedule', data, {headers: this.headers})
      .map((resp: Response) => {
        return resp.json();
      })
      .do((data: any) => {
        return data;
      });
  }

  getWaterBody(data) {
    return this.http.get(this.baseurl + 'classes/WaterBodySchedule?where=' + JSON.stringify(data), {headers: this.headers})
      .map((resp: Response) => {
        return resp.json();
      })
      .do((data: any) => {
        return data;
      });
  }

  sendBatch(data) {
    return this.http.post(this.baseurl + 'batch', data, {headers: this.headers})
      .map((resp: Response) => {
        return resp.json();
      })
      .do((data: any) => {
        return data;
      });
  }

  uploadFile(img, desc) {
    // Destination URL
    let url = this.server_url + 'uploadImages';
    
    // File for Upload
    var targetPath = img;

    var options: FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'desc': desc }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options);
  }

  showAlert(title, msg) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
