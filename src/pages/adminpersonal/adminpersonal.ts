import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Navbar } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/NativeService'
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
  clientName: any = '';
  accountName: any = '';
  salesmanCode: any = '';
  u_token: any;
  constructor(
    public navCtrl: NavController,
    public appConfigCtrl: AppConfig,
    private storageCtrl: Storage,
    private nativeService: NativeService,
    public navParams: NavParams) {
    this.storageCtrl.get('u_clientName').then((val) => {
      this.clientName = val;
    });
    this.storageCtrl.get('u_salesmanCode').then((val) => {
      this.salesmanCode = val;
    });
    this.storageCtrl.get('u_accountName').then((val) => {
      this.accountName = val;
    });
    this.storageCtrl.get('u_accountName').then((val) => {
      this.accountName = val;
    });
    this.storageCtrl.get('c_token').then((val) => {
      this.u_token = val;
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdminhomePage');
  }

  checkVersion() {
    //1、前台，2、后台
    let versiontype = 2;
    this.nativeService.detectionUpgrade(this.u_token, versiontype);
  }
  modifyPwd() {
    this.navCtrl.push('AdminmodifypswPage');
  }
  logOut() {
    this.storageCtrl.clear();
    this.navCtrl.setRoot('AdminloginPage');
  }
  aboutme() {
    this.navCtrl.push('AdminaboutPage');
  }
}
