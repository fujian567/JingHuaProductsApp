import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
管理端：首营管理界面
 */

@IonicPage()
@Component({
  selector: 'page-adminauditinfo',
  templateUrl: 'adminauditinfo.html',
})
export class AdminauditinfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  auditInfo() {
    this.navCtrl.push('AdminauditinfolistPage');
  }
  replenishInfo() {
    this.navCtrl.push('AdminreplenishinfolistPage');
  }
}
