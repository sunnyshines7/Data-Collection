import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';
import { forEachSeries, forEach } from 'p-iteration';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncPage');
  }

  ngOnInit() {
    var data = JSON.parse(localStorage.getItem('water_schedule'));
    var isNetwork = localStorage.getItem('network');
    if(isNetwork == 'offline'){
      this.isUploaded = "Please connect to internet to upload";
    }else{
      this.isUploaded = 'Data is being Uploaded Please wait';
      if(data) {
        var promises = [];
        var this_ref= this;
        forEachSeries(data, (val, key) => {

          var promise = new Promise(function(resolve, reject) {
            // data[i].photo = data[i].photo ? data[i].photo : '';
            //@ts-ignore
            this_ref.dbService.uploadFile(val.photo, '').then(res => {
            console.log(res);
            // console.log(data +""+i);
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
        });
      }else{
        this.isUploaded = 'Data is Up to date';
      }
    }
  }


}
