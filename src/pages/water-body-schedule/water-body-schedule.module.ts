import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaterBodySchedulePage } from './water-body-schedule';

@NgModule({
  declarations: [
    WaterBodySchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(WaterBodySchedulePage),
  ],
})
export class WaterBodySchedulePageModule {}
