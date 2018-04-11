import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,App} from 'ionic-angular';

/**
客户端：订单成功提交页
 */

@IonicPage()
@Component({
  selector: 'page-ordersuccess',
  templateUrl: 'ordersuccess.html',
})
export class OrdersuccessPage {

  constructor(
    public navCtrl: NavController, 
    public app: App,
    public navParams: NavParams) {
  }

  jumphome() {
    this.navCtrl.setRoot('TabsPage');
  }
  jumporder() {
    this.app.getRootNav().setRoot('OrdermanagePage', { type: 'noaudit' });
  }
}
