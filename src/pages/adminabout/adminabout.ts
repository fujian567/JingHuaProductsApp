import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
管理端：关于我们
 */

@IonicPage()
@Component({
  selector: 'page-adminabout',
  templateUrl: 'adminabout.html',
})
export class AdminaboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminaboutPage');
  }

}
