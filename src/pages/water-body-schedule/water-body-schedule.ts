import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { normalizeURL } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the WaterBodySchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-water-body-schedule',
  templateUrl: 'water-body-schedule.html',
})
export class WaterBodySchedulePage {
  directory: any;
  user: any;
  wbs: any = {};
  isNetwork: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider, public camera: Camera, public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaterBodySchedulePage');
  }

  ngOnInit() {
    this.user = this.dbService.getCurrentUser();
    console.log(this.user);
    this.directory = JSON.parse(localStorage.getItem('directory'));
    this.isNetwork = localStorage.getItem('network');  
    console.log(this.isNetwork)
  }

  takePhoto() {
    /* var geo_opt = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      alert(JSON.stringify(resp));
      alert(JSON.stringify(resp.coords));
    }).catch((error) => {
      console.log('Error getting location', error);
    }); */
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      // quality: 25,
      correctOrientation: true,
      sourceType: 1
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //  let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.wbs.photo = normalizeURL(imageData);
    }, (err) => {
     // Handle error
    });
  }

  saveData(water) {
    if(!water.directory){
      alert("Please select a village");
      return;
    }
    water.directory = {
      "__type": "Pointer",
      "className": "Directory",
      "objectId": water.directory.objectId
    };
    water.user = {
      "__type": "Pointer",
      "className": "_User",
      "objectId": this.user.objectId
    }
    water.type = this.user.directory.area;
    if(this.isNetwork == 'online') {
      this.dbService.saveWaterSchedule(water).subscribe((resp: any) => {
        console.log("sucess");
        this.navCtrl.setRoot(HomePage);
      },
      error => {
        if (error) {
          console.error(error);
        }
      })
    }else {
      console.log("offline");
      var prev_data = JSON.parse(localStorage.getItem('water_schedule'));
      var data = prev_data ? prev_data : [];
      data.push(water);
      localStorage.setItem('water_schedule', JSON.stringify(data));
      this.navCtrl.setRoot(HomePage);
    }
  }

  changedVillage(data) {
    this.wbs.uik = this.user.directory.area_code+'/'+this.user.directory.state_code+'/'+this.user.directory.district_code+'/'+this.user.directory.mandal_code+'/'+this.wbs.directory.village_code+'/';
  }

  

}
