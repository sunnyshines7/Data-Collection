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
    // console.log(this.user);
  }
}
