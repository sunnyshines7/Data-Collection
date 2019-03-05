import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaterViewPage } from './water-view';

@NgModule({
  declarations: [
    WaterViewPage,
  ],
  imports: [
    IonicPageModule.forChild(WaterViewPage),
  ],
})
export class WaterViewPageModule {}
