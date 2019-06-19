import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { DbProvider } from '../providers/db/DbProvider';
// import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';
import { WaterBodySchedulePage } from '../pages/water-body-schedule/water-body-schedule';
import { ReportsPage } from '../pages/reports/reports';

import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';
import { SyncPage } from '../pages/sync/sync';
import { FileTransfer } from '@ionic-native/file-transfer';
import { WaterViewPage } from '../pages/water-view/water-view';
import { LogoutPage } from '../pages/logout/logout';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    WaterBodySchedulePage,
    ReportsPage,
    SyncPage,
    WaterViewPage,
    LogoutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    WaterBodySchedulePage,
    ReportsPage,
    SyncPage,
    WaterViewPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DbProvider,
    NetworkProvider,
    Network,
    FileTransfer
    
    // HTTP
  ]
})
export class AppModule {}
