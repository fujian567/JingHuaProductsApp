import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
管理端：等待管理-搜索订单
 */

@IonicPage()
@Component({
  selector: 'page-admin-part-search-order',
  templateUrl: 'admin-part-search-order.html',
})
export class AdminPartSearchOrderPage {
  searchTxt: any = '';
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
  }

  selectOrder() {
    this.viewCtrl.dismiss(this.searchTxt, 'AdminorderPage', {
        animate: false
      });
  }

}
