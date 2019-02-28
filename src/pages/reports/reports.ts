import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';

/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  user: any;
  directory: any;
  wbs: any = {};
  waterList: any; 
  isNetWork: boolean;
  server_url: string = 'http://192.168.1.43:8081/';

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
  }

  ngOnInit() {
    this.user = this.dbService.getCurrentUser();
    this.directory = JSON.parse(localStorage.getItem('directory'));
    this.isNetWork = localStorage.getItem('network') == 'online' ? true : false;
  }

  changedVillage(data) {
    var obj = {
      "directory":{
        "__type": "Pointer",
        "className": "Directory",
        "objectId": data.objectId
      }
    }
    this.dbService.getWaterBody(obj).subscribe((resp: any) => {
      console.log("sucess");
      console.log(resp.results);
      this.waterList = resp.results;
    },
    error => {
      if (error) {
        console.error(error);
      }
    })
  }

}
