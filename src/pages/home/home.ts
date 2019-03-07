import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user:any;
  district: any;
  mandal: any;
  village; any;

  constructor(public navCtrl: NavController, public dbService: DbProvider) {

  }

  ngOnInit() {
    this.user = this.dbService.getCurrentUser();
    var isNetwork = localStorage.getItem('network');
    if(isNetwork == 'online'){
      this.user.state = '';
      this.user.district = '';
      this.user.mandal = '';
      var query = {"__type": "Pointer", "className": "Directory", "objectId": this.user.directory.objectId};
      this.getCount(query);
    }
    // console.log(this.user);
  }

  selectNext(type) {
    console.log(type);
    console.log(this.user.state);
    var sel, params, qry;
    if(type == 'state'){
      sel = {
        "state_name": this.user.state
      };
      params = '&distinct=district_name'
      qry = {"$inQuery":{"where":{"state_name":this.user.state,"area":"rural"},"className":"Directory"}}
      this.getCount(qry);
    }
    if(type == 'district'){
      sel = {
        "district_name": this.user.district
      };
      params = '&distinct=mandal'
      qry = {"$inQuery":{"where":{"district_name":this.user.district,"area":"rural"},"className":"Directory"}}
      this.getCount(qry);
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
    var qry = {"$inQuery":{"where":{"mandal":this.user.mandal,"area":"rural"},"className":"Directory"}}
    this.getCount(qry);

    this.dbService.getDirectory(this.user.district, this.user.state, this.user.mandal).subscribe((resp) => {
      console.log(resp);
      this.village = resp.results;
    },
    (err) => {
      console.error(err);
    })
  }

  getCount(qry) {
    var req_batch = {
      "requests": [
        {
          "method": "GET",
          "path": "/parse/classes/WaterBodySchedule",
          "body": {
            "where":{
              // "type": "rural",
              "directory": qry
              // "directory":{"$inQuery":{"where":{"district_name":this.user.directory.district_name,"area":"rural"},"className":"Directory"}}
            },
            "count": 1,
            "limit": 0
          }
        },
        {
          "method": "GET",
          "path": "/parse/classes/WaterBodySchedule",
          "body": {
            "where":{
              // "type": "urban",
              "directory": qry
              // "directory":{"$inQuery":{"where":{"district_name":this.user.directory.district_name,"area":"urban"},"className":"Directory"}}
            },
            "count": 1,
            "limit": 0
          }
        }
      ]
    };

    this.dbService.sendBatch(req_batch).subscribe((counts: any) => {
      console.log(counts);
      this.user.ruralCount = counts[0].success.count;
      this.user.urbanCount = counts[1].success.count;
      if(localStorage.getItem('water_schedule')){
        var local_count = JSON.parse(localStorage.getItem('water_schedule')).length;
        this.user.ruralCount = this.user.ruralCount + local_count;
      }
      this.dbService.setCurrentUser(this.user);
    },
    error => {
      if (error) {
        console.error(error);
      }
    });
  }

  selectVillage(directory) {
    var qry = {"__type": "Pointer", "className": "Directory", "objectId": directory.objectId};
    this.getCount(qry);
  }
}
