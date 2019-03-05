import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user:any;

  constructor(public navCtrl: NavController, public dbService: DbProvider) {

  }

  ngOnInit() {
    this.user = this.dbService.getCurrentUser();
    var isNetwork = localStorage.getItem('network');
    if(isNetwork == 'online'){
      var req_batch = {
        "requests": [
          {
            "method": "GET",
            "path": "/parse/classes/WaterBodySchedule",
            "body": {
              "where":{
                "type": "rural",
                "directory": {"__type": "Pointer", "className": "Directory", "objectId": this.user.directory.objectId} 
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
                "type": "urban",
                "directory": {"__type": "Pointer", "className": "Directory", "objectId": this.user.directory.objectId} 
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
    // console.log(this.user);
  }
}
