import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
客户端：支付失败
 */

@IonicPage()
@Component({
  selector: 'page-orderfailed',
  templateUrl: 'orderfailed.html',
})
export class OrderfailedPage {
  c_token: any;
  jumpType: any = "";
  error: any = "";
  constructor(
    public navCtrl: NavController,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (this.navParams.data != undefined) {
      this.error = this.navParams.data.item;
    }
  }

  jumphome() {
    this.navCtrl.push('TabsPage');
  }
  jumporder() {
    this.navCtrl.push('OrdermanagePage', { type: 'nopay', c_token: this.c_token })
  }

}
