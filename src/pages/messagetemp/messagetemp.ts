import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { AppConfig } from '../../app/app.config';

/**
管理端：极光推送消息展示页
 */

@IonicPage()
@Component({
  selector: 'page-messagetemp',
  templateUrl: 'messagetemp.html',
})
export class MessagetempPage {
  @ViewChild(Navbar) navBar: Navbar;
  msgTitle: any;
  msgContent: any;
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.msgTitle = navParams.get('title');
    this.msgContent = navParams.get('alert');
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('MessagelistPage');
  }
  goBack() {
    this.navCtrl.push('MessagelistPage');
  }
}
