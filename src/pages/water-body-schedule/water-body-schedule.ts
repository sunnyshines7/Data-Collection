import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { normalizeURL } from 'ionic-angular';
import { HomePage } from '../home/home';
// import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


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
  selectedDirectory: any = {};
  isGpsEnabled: boolean= false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider, public camera: Camera, private geolocation: Geolocation, public locationAccuracy: LocationAccuracy) {//, public diagnostic: Diagnostic
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaterBodySchedulePage');
  }

  ngOnInit() {
    this.enableGPS(false);
   
    this.user = this.dbService.getCurrentUser();
    console.log(this.user);
    this.directory = JSON.parse(localStorage.getItem('directory'));
    this.isNetwork = localStorage.getItem('network');  
    console.log(this.isNetwork);
    // convert 1 to 001
    var temp = this.user.ruralCount+1;
    var temp_str = temp.toString();
    var temp_len = temp_str.length
    // temp_str = temp_len<3 && temp_len>1 ? '0'+ temp_str : (temp_len<2 && temp_len>0 ? '00'+temp_str : temp_str);
    temp_str = temp_len<4 && temp_len>2 ? '0'+ temp_str : (temp_len<3 && temp_len>1 ? '00'+temp_str : (temp_len<2 && temp_len>0 ? '000'+temp_str : temp_str));
    this.wbs.sl_no = this.user.ruralCount + 1;
    // this.wbs.uik = this.user.directory.area_code+'/'+this.user.directory.state_code+'/'+this.user.directory.district_code+'/'+this.user.directory.mandal_code+'/'+this.user.directory.village_code+'/'+ temp_str;
    this.wbs.uik = '01'+'/'+this.user.directory.state_code+'/'+this.user.directory.district_code+'/'+this.user.directory.mandal_code+'/'+this.user.directory.village_code+'/'+ temp_str;
    
    this.wbs.enumeration = (new Date()).toISOString();
  }

  updateUIK() {
    // this.wbs.uik2 = this.user.directory.area_code+'/'+this.user.directory.state_code+'/'+this.user.directory.district_code+'/'+this.user.directory.mandal_code+'/'+this.user.directory.village_code+'/'+ this.wbs.sl_no2;  
    this.wbs.uik2 = '01'+'/'+this.user.directory.state_code+'/'+this.user.directory.district_code+'/'+this.user.directory.mandal_code+'/'+this.user.directory.village_code+'/'+ this.wbs.sl_no2;  
  }

  takePhoto() {
    if(this.isGpsEnabled){
      this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log(resp);
        // alert(resp.coords.latitude+ '::'+resp.coords.longitude);
        this.wbs.location = {
            "__type": "GeoPoint",
            "latitude": resp.coords.latitude,
            "longitude": resp.coords.longitude
        }
  
      const options: CameraOptions = {
        destinationType: this.camera.DestinationType.FILE_URI,
        quality: 75,
        correctOrientation: true,
        sourceType: 1,
        saveToPhotoAlbum: true
      }
      
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        //  let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.wbs.photo = normalizeURL(imageData);
        
      }, (err) => {
       // Handle error
      });
    }).catch((error) => {
      console.log('Error getting location', error);
      alert('Error in getting location, Plaese check your GPS');
    });
    }
    else{
      alert('Please enable GPS');
      this.enableGPS(true);
    }
  }

  enableGPS(forPhoto) {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        console.log('Request successful');
        this.isGpsEnabled = true;
        if(forPhoto){
          this.takePhoto();
        }
      },
      error => console.log('Error requesting location permissions', error)
    );
  }

  saveOffline(water) {
    if(!this.wbs.photo){
      alert("Please select an Image");
      return;
    }
    if(!this.wbs.location){
      alert("Unable to get Location, Plaese check your GPS ");
      return;
    }
    water.directory = {
      "__type": "Pointer",
      "className": "Directory",
      "objectId": this.user.directory.objectId
      // "objectId": this.selectedDirectory.objectId
    };
    water.user = {
      "__type": "Pointer",
      "className": "_User",
      "objectId": this.user.objectId
    }
    water.type = this.user.directory.area;
    console.log("offline");
    var prev_data = JSON.parse(localStorage.getItem('water_schedule'));
    var data = prev_data ? prev_data : [];
    data.push(water);
    localStorage.setItem('water_schedule', JSON.stringify(data));
    this.user.ruralCount = this.wbs.sl_no;
    this.dbService.setCurrentUser(this.user);
    this.dbService.showAlert('Data Saved', 'Data saved locally and sync when the internet is available');
    this.wbs = {};
    this.navCtrl.setRoot(HomePage);
  }

  saveData(water) {
    if(!this.wbs.photo){
      alert("Please select an Image");
      return;
    }
    /* if(!this.selectedDirectory){
      alert("Please select a village");
      return;
    } */
    water.directory = {
      "__type": "Pointer",
      "className": "Directory",
      "objectId": this.user.directory.objectId
      // "objectId": this.selectedDirectory.objectId
    };
    water.user = {
      "__type": "Pointer",
      "className": "_User",
      "objectId": this.user.objectId
    }
    water.type = this.user.directory.area;
    if(this.isNetwork == 'online') {
      // this.wbs.photo = this.wbs.photo ? this.wbs.photo : '';
      this.dbService.uploadFile(this.wbs.photo, '').then(res => {
        console.log(res);
        this.wbs.imageFile = JSON.parse(res.response);
        console.log(water);
        this.dbService.saveWaterSchedule(water).subscribe((resp: any) => {
          console.log("sucess");
          this.navCtrl.setRoot(HomePage);
        },
        error => {
          if (error) {
            console.error(error);
          }
        });
      }, err => {
        console.error(err);
      });;
      
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
    // this.wbs.uik = this.user.directory.area_code+'/'+this.user.directory.state_code+'/'+this.user.directory.district_code+'/'+this.user.directory.mandal_code+'/'+data.village_code+'/';
    this.wbs.uik = '01'+'/'+this.user.directory.state_code+'/'+this.user.directory.district_code+'/'+this.user.directory.mandal_code+'/'+data.village_code+'/';
  }

  formatGovtId(e) {
    console.log(e);
    console.log(e.keyCode);
    console.log(e.key)
    var len = this.wbs.govt_wbId.length;
    console.log(len);
    if((e.which > 47 && e.which < 57) || e.which == 229){
      if(len == 1 || len == 4 || len == 7 || len == 10 || len == 17){
        this.wbs.govt_wbId = this.wbs.govt_wbId + '/'
      } 
      if(len > 21){
        this.wbs.govt_wbId = (this.wbs.govt_wbId.substring(0, this.wbs.govt_wbId.length - 1));
      }
    }else if(e.which == 8 || e.which == 46){
      if(len == 1 || len == 4 || len == 7 || len == 10 || len == 17){
        this.wbs.govt_wbId = (this.wbs.govt_wbId.substring(0, this.wbs.govt_wbId.length - 1));  
      } 
    }
    else{
      this.wbs.govt_wbId = (this.wbs.govt_wbId.substring(0, this.wbs.govt_wbId.length - 1));
    }
  }  

  

}
