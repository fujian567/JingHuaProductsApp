import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
管理端：商品管理首页界面
 */

@IonicPage()
@Component({
  selector: 'page-admingoods',
  templateUrl: 'admingoods.html',
})
export class AdmingoodsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmingoodsPage');
  }
  goodscategory(){
    this.navCtrl.push('AdmingoodscategoryPage');
  }
  goodsmanage(){
    this.navCtrl.push('AdmingoodslistPage');
  }
}
