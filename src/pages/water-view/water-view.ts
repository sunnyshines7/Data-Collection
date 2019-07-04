import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SyncPage } from '../sync/sync';
import { DbProvider } from '../../providers/db/DbProvider';

/**
 * Generated class for the WaterViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-water-view',
  templateUrl: 'water-view.html',
})
export class WaterViewPage {
  waterData: any;
  page: string;
  user: any;
  server_url: string = 'http://trac.telangana.gov.in:8081/';

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaterViewPage');
  }

  ngOnInit() {
    this.user = this.dbService.getCurrentUser();
    this.waterData = this.navParams.get('waterData');
    this.page = this.navParams.get('page_name');
  }

  deleteData(toDel) {
    var waterList = JSON.parse(localStorage.getItem('water_schedule'));
    var pos = (waterList.map(function(x){if(x){return x.uik}})).indexOf(this.waterData.uik);
    waterList.splice(pos, 1);
    localStorage.setItem('water_schedule', JSON.stringify(waterList));
    if(toDel){
      this.user.ruralCount = this.user.ruralCount-1;
      this.dbService.setCurrentUser(this.user);
    }
    this.navCtrl.setRoot(SyncPage, {page_name: 'sync'});
  }

  saveData() {
    const loader = this.loadingCtrl.create({
      content: "Sending the data to server",
    });
    loader.present();
    if(this.waterData) {
      this.dbService.uploadFile(this.waterData.photo, '').then(res => {
        console.log(res);
        this.waterData.imageFile = JSON.parse(res.response);
        this.dbService.saveWaterSchedule(this.waterData).subscribe((resp: any) => {
          console.log("sucess");
          loader.dismiss();
          this.deleteData(false);
        },
        error => {
          if (error) {
            console.error(error);
          }
        })
      }, err => {
        console.error(err);
      });
    }
  }
}
