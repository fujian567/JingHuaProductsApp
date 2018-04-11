import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Navbar } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
/**
管理端：个人中心
 */

@IonicPage()
@Component({
  selector: 'page-adminpersonal',
  templateUrl: 'adminpersonal.html',
})
export class AdminpersonalPage {
  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    public navCtrl: NavController,
    public appConfigCtrl: AppConfig,
    public navParams: NavParams) {
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdminhomePage');
  }

  checkVersion() {
    this.appConfigCtrl.popAlertView('当前已经是最新版本');
  }
  modifyPwd() {
    this.navCtrl.push('AdminmodifypswPage');
  }
  logOut() {
    this.navCtrl.setRoot('AdminloginPage');
  }
  aboutme() {
    this.navCtrl.push('AdminaboutPage');
  }
}
