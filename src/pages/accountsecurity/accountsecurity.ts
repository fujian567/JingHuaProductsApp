import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
客户端：安全中心
 */

@IonicPage()
@Component({
  selector: 'page-accountsecurity',
  templateUrl: 'accountsecurity.html',
})
export class AccountsecurityPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  modifyPwd() {
    this.navCtrl.push('ModifypwdPage');
  }
  modifyMobile() {
    this.navCtrl.push('ModifymobilePage');
  }
}
