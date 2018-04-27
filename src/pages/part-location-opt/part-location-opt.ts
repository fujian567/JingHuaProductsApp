import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
省市区地区选择
 */

@IonicPage()
@Component({
  selector: 'page-part-location-opt',
  templateUrl: 'part-location-opt.html',
})
export class PartLocationOptPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartLocationOptPage');
  }

}
