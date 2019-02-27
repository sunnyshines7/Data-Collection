import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, NavController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DbProvider } from '../providers/db/DbProvider';
import { WaterBodySchedulePage } from '../pages/water-body-schedule/water-body-schedule';
import { ReportsPage } from '../pages/reports/reports';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';
import { SyncPage } from '../pages/sync/sync';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: NavController;
  rootPage:any = LoginPage;
  homePage:any = HomePage;
  waterPage: any = WaterBodySchedulePage;
  reportPage: any = ReportsPage;
  syncPage: any = SyncPage;
  is_authorized = true;
  user: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public dbService: DbProvider, public menuCtrl: MenuController, public events: Events, public networkProvider: NetworkProvider, public network: Network) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.networkProvider.initializeNetworkEvents();

        // Offline event
      this.events.subscribe('network:offline', () => {
          alert('network:offline ==> '+this.network.type);  
          localStorage.setItem('network', 'offline');  
      });

      // Online event
      this.events.subscribe('network:online', () => {
          alert('network:online ==> '+this.network.type);        
          localStorage.setItem('network', 'online');  
      });
    });
    
    events.subscribe('user:singedin', (user) => {
      if (user) {
          this.is_authorized = true;
          this.rootPage = HomePage
      } else {
          this.rootPage = LoginPage;
      }
    });
  }

  ngOnInit() {
    if(localStorage){
      var auth = localStorage.auth;
      this.is_authorized =  true;
      // this.is_authorized = localStorage.getItem('auth') == 'loggedIn' ? true : false;
      this.user = this.dbService.getCurrentUser();
      if( auth && auth =='loggedIn' ) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    } else{
      this.rootPage = LoginPage;
    }
  }

  

  Onload(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  OnLogout() {
    this.is_authorized = false;
    localStorage.clear();
    this.menuCtrl.close();
    this.nav.setRoot(LoginPage)
  }

}

