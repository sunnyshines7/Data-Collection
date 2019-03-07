import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';
import { LoginPage } from '../login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: any = {};
  district: any;
  mandal: any;
  village: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
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

  selectedDirectory(village) {
    this.user.username = village.district_code+village.mandal_code+village.village_code;
  }

  register(data) {
    var user_obj = {
      "username": data.username,
      "password": data.password,
      "directory": {
        "__type": "Pointer",
        "className":"Directory",
        "objectId": data.village.objectId
      },
      "type": "user"
    };
    this.dbService.signup(user_obj).subscribe((resp) => {
      console.log(resp);
      this.navCtrl.setRoot(LoginPage);
    },
    (err) => {
      console.error(err);
      alert("Account already exists for this username. Contact Your Admin")
    })
  }
  navTo() {
    this.navCtrl.setRoot(LoginPage);
  }
}
