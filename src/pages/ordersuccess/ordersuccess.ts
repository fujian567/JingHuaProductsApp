import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
客户端：订单成功提交页
 */

@IonicPage()
@Component({
  selector: 'page-ordersuccess',
  templateUrl: 'ordersuccess.html',
})
export class OrdersuccessPage {
  c_token: any;
  constructor(
    public navCtrl: NavController,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
  }

  jumphome() {
    this.navCtrl.setRoot('TabsPage');
  }
  jumporder() {
    //this.app.getRootNavById().setRoot('OrdermanagePage', { type: 'noaudit' });
    this.navCtrl.push('OrdermanagePage', { type: 'noaudit', c_token: this.c_token })
  }
}
