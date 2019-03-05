import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SyncPage } from '../sync/sync';
import { DbProvider } from '../../providers/db/DbProvider';

/**
 * Generated class for the WaterViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-water-view',
  templateUrl: 'water-view.html',
})
export class WaterViewPage {
  waterData: any;
  page: string;
  user: any;
  server_url: string = 'http://trac.telangana.gov.in:8081/';

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaterViewPage');
  }

  ngOnInit() {
    this.user = this.dbService.getCurrentUser();
    this.waterData = this.navParams.get('waterData');
    this.page = this.navParams.get('page_name');
  }

  deleteData() {
    var waterList = JSON.parse(localStorage.getItem('water_schedule'));
    var pos = (waterList.map(function(x){if(x){return x.uik}})).indexOf(this.waterData.uik);
    waterList.splice(pos, 1);
    localStorage.setItem('water_schedule', JSON.stringify(waterList));
    this.user.ruralCount = this.user.ruralCount-1;
    this.dbService.setCurrentUser(this.user);
    this.navCtrl.setRoot(SyncPage, {page_name: 'sync'});
  }

}
