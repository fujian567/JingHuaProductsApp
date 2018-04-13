import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { Storage } from '@ionic/storage';
import { MultiPicker } from 'ion-multi-picker';

/**
客户端：地址编辑
 */

@IonicPage()
@Component({
  selector: 'page-shippingaddressedit',
  templateUrl: 'shippingaddressedit.html',
})
export class ShippingaddresseditPage {
  @ViewChild(MultiPicker) multiPicker: MultiPicker;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  c_token: any;
  dependentColumns: any[] = [];
  provincejson: any;
  cityjson: any;
  countyjson: any;
  region: any;
  pageedit: boolean = false;
  imageList: any = [];
  clientDeliveryInfo: any = {
    DeliveryAddressId: this._guid,
    AccountID: this._guid,
    DeliveryName: '',
    DeliveryMobile: '',
    ProvinceID: '',
    CityID: '',
    CountyID: '',
    Address: '',
    PCCName: '',
    DeliveryLabel: '公司',
    DeliveryDefault: false,
    SCDeliveryDefault: false,
  }
  pccName: any = '';
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public appConfigCtrl: AppConfig,
    private storageCtrl: Storage,
    private ref: ChangeDetectorRef,
    public app: App,
    public navParams: NavParams,
  ) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    // this.storageCtrl.get('c_account').then((val) => {
    //   this.clientDeliveryInfo.AccountID = val;
    // });
    if (this.navParams.data.item != undefined) {
      let parmas = this.navParams.data.item;
      this.clientDeliveryInfo.DeliveryAddressId = parmas.deliveryAddressId;
      this.clientDeliveryInfo.AccountID = parmas.accountID;
      this.clientDeliveryInfo.DeliveryName = parmas.deliveryName;
      this.clientDeliveryInfo.DeliveryMobile = parmas.deliveryMobile;
      this.clientDeliveryInfo.ProvinceID = parmas.provinceID;
      this.clientDeliveryInfo.CityID = parmas.cityID;
      this.clientDeliveryInfo.CountyID = parmas.countyID;
      this.clientDeliveryInfo.Address = parmas.address;
      this.clientDeliveryInfo.PCCName = parmas.pccName;
      this.clientDeliveryInfo.DeliveryLabel = parmas.deliveryLabel;
      this.clientDeliveryInfo.DeliveryDefault = parmas.deliveryDefault;
      this.clientDeliveryInfo.SCDeliveryDefault = parmas.scDeliveryDefault;
      this.pageedit = true;
      this.pccName = parmas.pccName;
    }
    if (navParams.data.imageList != undefined) {
      if (navParams.data.imageList.length > 0) {
        this.imageList = navParams.data.imageList
      }
    }
    this.getRegion();
  }
  ionViewDidEnter() {
    let text = document.getElementsByClassName("multi-picker-placeholder");
    for (let i = 0; i < text.length; i++) {
      text[i].textContent = this.pccName
    }
  }
  getRegion() {
    this.appService.getRegionContact()
      .subscribe(rs => {
        this.region = rs.json();
        let provinceData = this.region.filter(function (e) { return e.IsSingleCity == '1'; });
        let cityData = this.region.filter(function (e) { return e.IsSingleCity == '2'; });
        let countyData = this.region.filter(function (e) { return e.IsSingleCity == '3'; });
        //省份
        this.provincejson = {
          options: AppStaticConfig.addRegionData(provinceData)
        }
        this.dependentColumns.push(this.provincejson);
        //城市
        this.cityjson = {
          options: AppStaticConfig.addRegionData(cityData)
        }
        this.dependentColumns.push(this.cityjson);
        //区县
        this.countyjson = {
          options: AppStaticConfig.addRegionData(countyData)
        }
        this.dependentColumns.push(this.countyjson);
        console.log(this.dependentColumns)
        this.ref.detectChanges();
      }, error => {
        console.log(error);
      });
  }
  addnewAddress() {
    if (this.clientDeliveryInfo.DeliveryName.length < 1) {
      this.appConfigCtrl.popAlertView('收货人不能为空');
      return
    }
    if (this.clientDeliveryInfo.DeliveryMobile.length < 1) {
      this.appConfigCtrl.popAlertView('手机号码不能为空');
      return
    }
    if (this.pccName.length < 1) {
      this.appConfigCtrl.popAlertView('收货地址不能为空');
      return
    }
    if (this.clientDeliveryInfo.Address.length < 1) {
      this.appConfigCtrl.popAlertView('详细地址不能为空');
      return
    }
    if (!AppStaticConfig.verifyMobile(this.clientDeliveryInfo.DeliveryMobile)) {
      this.appConfigCtrl.popAlertView('请填写正确手机号');
      return
    }
    this.clientDeliveryInfo.PCCName = document.getElementById('PCCname').textContent.trim();
    let tempLocation: any = this.pccName.split(' ');
    this.clientDeliveryInfo.ProvinceID = tempLocation[0];
    this.clientDeliveryInfo.CityID = tempLocation[1];
    this.clientDeliveryInfo.CountyID = tempLocation[2];
    let previouspage = localStorage.getItem('previouspage');
    let url = '';
    if (this.pageedit) {
      url = AppGlobal.API.postDeliveUpdate;
    } else {
      url = AppGlobal.API.postDelivery;
    }
    this.appService.httpPost_token(url, this.c_token, this.clientDeliveryInfo, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (previouspage != null) {
          localStorage.clear();
          this.navCtrl.setRoot(previouspage, {
            imageList: this.imageList
          })
        } else {
          this.navCtrl.push('ShippingaddressPage');
        }
      }else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }

}
