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
  jumpType: any = "";
  orderID: any;
  constructor(
    public navCtrl: NavController,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (this.navParams.data != undefined) {
      this.jumpType = this.navParams.data.item;
      // if (this.navParams.data.item.orderID != undefined) {
      //   this.orderID = this.navParams.data.item.orderID
      // }
    }
  }

  jumphome() {
    this.navCtrl.push('TabsPage');
  }
  jumporder() {
    if (this.jumpType == '1' || this.jumpType == '2') {
      // if (this.orderID != undefined) {
      //   this.navCtrl.push('OrderdetailPage', { orderId: this.orderID, c_token: this.c_token })
      // } else {
      //   this.navCtrl.push('OrdermanagePage', { type: 'nodeliver', c_token: this.c_token })
      // }
      this.navCtrl.push('OrdermanagePage', { type: 'nodeliver', c_token: this.c_token })
    } else {
      this.navCtrl.push('OrdermanagePage', { type: 'noaudit', c_token: this.c_token })
    }
  }
}
