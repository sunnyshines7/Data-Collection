import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { DbProvider } from '../../providers/db/DbProvider';
import { HomePage } from '../home/home';
import { NgForm } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbServices: DbProvider, public alertCtrl: AlertController, public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onSignIn(form: NgForm) {
    /* localStorage.auth = 'loggedIn';
    this.navCtrl.setRoot( HomePage );
    this.events.subscribe('user:singedin', (user) => {
      if (user) {
          this.navCtrl.setRoot(HomePage)
      } else {
          this.navCtrl.push(LoginPage)
      }
    }); */

    this.dbServices.signIn(form.value.email_id,form.value.auth)
      .subscribe((data: any) => {
        // console.log(data);
        localStorage.auth = 'loggedIn';
        this.dbServices.getUser(data.objectId).subscribe((user: any) => {
          console.log(data);
          var req_batch = {
            "requests": [
              {
                "method": "GET",
                "path": "/parse/classes/WaterBodySchedule",
                "body": {
                  "where":{
                    "type": "rural",
                    "directory": data.directory
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
                    "directory": data.directory
                  },
                  "count": 1,
                  "limit": 0
                }
              }
            ]
          };
          this.dbServices.sendBatch(req_batch).subscribe((counts: any) => {
            user.ruralCount = counts[0].success.count;
            user.urbanCount = counts[1].success.count;
            this.dbServices.setCurrentUser(user);
          },
          error => {
            if (error) {
              console.error(error);
            }
          });
          
          this.dbServices.getDirectory(user.directory.district_name, user.directory.state_name, user.directory.mandal).subscribe((directory: any) => {
            // console.log(directory);
            localStorage.setItem('directory',JSON.stringify(directory.results));
            this.navCtrl.setRoot( HomePage );
          },
          error => {
            if (error) {
              console.error(error);
            }
          })
          // this.navCtrl.setRoot( HomePage );
        },
        error => {
          if (error) {
            console.error(error);
          }
        });
        this.events.subscribe('user:singedin', (user) => {
          if (user) {
              this.navCtrl.setRoot(HomePage)
          } else {
              this.navCtrl.push(LoginPage)
          }
        });

      },
      error => {
        if (error) {
            this.alertCtrl.create({
                title: "Login Failed",
                message: error.json().error,
                buttons: ['OK']
            }).present();
        }
    });
  }

}
