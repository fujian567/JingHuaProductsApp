import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';

/**
管理端：价格管理-添加地区价格   
 */

@IonicPage()
@Component({
  selector: 'page-admin-part-locationprice',
  templateUrl: 'admin-part-locationprice.html',
})
export class AdminPartLocationpricePage {
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  partPageModel: any = {
    location: '请选择地区',
    price: '',
    locationid: ''
  }
  selectLocationName: any = [];
  selectLocatioObj: any = [];
  alreadyItemID:any=[];
  ProductRegionalPrice: any = {
    PriceId: this._guid,
    CommParamId: '',
    ProvinceId: '',
    CityId: '000000',
    CountyId: '000000',
    RegionalClassId: '',
    PriceTypeId: '2',
    PriceTypeName: '',
    PriceCreateDate: '2018-4-08',
    PriceDec: '',
    RegionalPrice: '',
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    private appConfigCtrl: AppConfig
  ) {
    this.alreadyItemID = this.navParams.data.alreadyItemID;
  }
  closePop() {
    this.viewCtrl.dismiss();
  }
  selectLocation() {
    let popover = this.popoverCtrl.create('AdminPartLocationPage', { partPageModel: this.partPageModel, selectLocatioObj: this.selectLocatioObj,alreadyItemID:this.alreadyItemID }, {
      cssClass: 'select-location',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data != undefined) {
        this.selectLocatioObj = data;
        this.selectLocationName = [];
        for (let i = 0; i < data.length; i++) {
          this.selectLocationName.push(data[i].name);
          this.partPageModel.location = this.selectLocationName;
        }
      }
    });
  }
  confirmAdd() {
    if (this.selectLocatioObj.length < 1 || this.partPageModel.price.length == 0) {
      this.appConfigCtrl.popAlertView('请填写完整的地区价格再提交！');
    } else {
      this.viewCtrl.dismiss({ selectLocatioObj: this.selectLocatioObj, price: this.partPageModel.price }, 'AdmingoodpricePage', {
        animate: false
      });
    }
  }
}
