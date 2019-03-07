import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';
import { forEachSeries, forEach } from 'p-iteration';
import { WaterViewPage } from '../water-view/water-view';

/**
 * Generated class for the SyncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})
export class SyncPage {
  isUploaded: string;
  waterList: any;
  page: string;
  isNetwork: boolean;
  user: any;
  directory: any;
  server_url: string = 'http://trac.telangana.gov.in:8081/';

  district: any;
  mandal: any;
  village: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncPage');
  }

  ngOnInit() {
    this.page = this.navParams.get('page_name');
    this.user = this.dbService.getCurrentUser();
    this.directory = JSON.parse(localStorage.getItem('directory'));
    this.isNetwork = localStorage.getItem('network') == 'online' ? true : false;
    // this.changedVillage(this.user.directory);

    if(!this.isNetwork){
      this.isUploaded = this.page == 'sync' ? 'Please connect to internet to upload' : 'Please Connect to internet to View Data';
    }else{
      if(this.page == 'sync'){
        this.waterList = JSON.parse(localStorage.getItem('water_schedule'));
        this.isUploaded = !this.waterList ? 'Data is Up to Date' : ''; 
      }
      else {
        if(this.user.type!='admin'){
          this.changedVillage(this.user.directory);
        }
      }
    }
  }

  syncData() {
    const loader = this.loadingCtrl.create({
      content: "Sending the data to server",
    });
    loader.present();
    this.isUploaded = 'Data is being Uploaded Please wait';
    if(this.waterList) {
      var promises = [];
      var this_ref= this;
      forEachSeries(this.waterList, (val, key) => {

        var promise = new Promise(function(resolve, reject) {
          //@ts-ignore
          this_ref.dbService.uploadFile(val.photo, '').then(res => {
          console.log(res);
          //@ts-ignore
          val.imageFile = JSON.parse(res.response);
          this_ref.dbService.saveWaterSchedule(val).subscribe((resp: any) => {
            console.log("sucess");
            resolve();
            /* if(i == data.length-1){
              this_ref.isUploaded = false;
              localStorage.removeItem('water_schedule');
            } */
          },
          error => {
            if (error) {
              console.error(error);
            }
          })
        }, err => {
          console.error(err);
        });;
        
        });
          promises.push(promise);
      });
      Promise.all(promises).then(tempArr =>{
        this.isUploaded = 'Data Uploaded Complete';
        localStorage.removeItem('water_schedule'); 
        this.waterList = [];
        loader.dismiss();
        // this.dbService.showAlert('Data Saved', 'Data sent successfully')
      });
    }else{
      this.isUploaded = 'Data is Up to date';
    }
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
      this.isUploaded = !this.waterList ? 'No Records Found' : '';
    },
    error => {
      if (error) {
        console.error(error);
      }
    })
  }

  navToView(data) {
    this.navCtrl.push(WaterViewPage, {waterData : data, page_name: this.page})
  }

  selectNext(type) {
    console.log(type);
    console.log(this.user.state);
    var sel, params;
    if(type == 'state'){
      sel = {
        "state_name": this.user.state
      };
      params = '&distinct=district_name'
    }
    if(type == 'district'){
      sel = {
        "district_name": this.user.district
      };
      params = '&distinct=mandal'
    }
    /* if(type == 'mandal'){
      sel = {
        "mandal": this.user.mandal
      };
      params = '&distinct=village'
    } */
    
    this.dbService.getDirectoryByObject(sel, params).subscribe((resp) => {
      console.log(resp);
      if(type == 'state'){
        this.district = resp.results;
      }
      if(type == 'district'){
        this.mandal = resp.results;
      }
    },
    (err) => {
      console.error(err);
    })
  }

  getDirectory() {
    this.dbService.getDirectory(this.user.district, this.user.state, this.user.mandal).subscribe((resp) => {
      console.log(resp);
      this.village = resp.results;
    },
    (err) => {
      console.error(err);
    })
  }


}
