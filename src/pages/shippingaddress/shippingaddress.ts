import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
 * 客户端：收货地址管理
 */

@IonicPage()
@Component({
  selector: 'page-shippingaddress',
  templateUrl: 'shippingaddress.html',
})
export class ShippingaddressPage {
  @ViewChild(Navbar) navBar: Navbar;
  isShowSubimtForm: boolean = false;
  pageTitle: string = '地址管理';
  c_token: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  deliverdata: any = [];
  imageList: any = [];
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getDelivery(val);
      if (navParams.data.imageList != undefined) {
        this.imageList = navParams.data.imageList
      }

    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('TabsPage', { jumpage: 'person' });
  }
  getDelivery(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getDeliveryAll, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.deliverdata = [];
        localStorage.setItem('delivercount',rs.objectData.length)
        if (rs.objectData.length > 0) {
          this.deliverdata = rs.objectData;
        }
      }
    }, true)
  }
  editAddress(item: any) {
    this.navCtrl.push('ShippingaddresseditPage', {
      item: item,
      imageList: this.imageList
    })
  }
  addnewAddress() {
    this.navCtrl.push('ShippingaddresseditPage', {
      imageList: this.imageList
    })
  }
  deleteAddress(item: any) {
    this.appConfigCtrl.popAlertConfirmView('你确定要删除该地址吗？删除后不可恢复。', '再考虑下', '残忍删除', () => {
      this.appService.httpPost_token(AppGlobal.API.postDeliveDel, this.c_token, { deliveryAddressId: item.deliveryAddressId }, rs => {
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('LoginPage');
        }
        console.log(rs)
        if (rs.isSuccess) {
          this.getDelivery(this.c_token)
        } else {
          this.appConfigCtrl.popAlertView(rs.errorMessage);
        }
      }, true)
    })
  }
  default(item: any) {
    this.appService.httpPost_token(AppGlobal.API.postDeliveDefault, this.c_token, { deliveryAddressId: item.deliveryAddressId }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        this.getDelivery(this.c_token)
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
  selectAddress(item: any) {
    let previouspage = localStorage.getItem('previouspage');
    if (previouspage != null) {
      localStorage.clear();
      this.navCtrl.push(previouspage, { address: item, imageList: this.imageList })
    }
  }
}
