import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
客户端：选择售后理由
 */

@IonicPage()
@Component({
  selector: 'page-part-aftersale',
  templateUrl: 'part-aftersale.html',
})
export class PartAftersalePage {

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
  }

  selectReason(reason: string) {
    this.viewCtrl.dismiss(reason, 'AftersalePage', {
      animate: false
    });
  }
  closePop() {
    this.viewCtrl.dismiss('', '', {
      animate: false
    });
  }
}
