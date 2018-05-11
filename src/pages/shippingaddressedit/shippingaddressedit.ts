import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar, PopoverController } from 'ionic-angular';
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
  @ViewChild(Navbar) navBar: Navbar;
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
    pccName: '',
    DeliveryLabel: '公司',
    DeliveryDefault: false,
    SCDeliveryDefault: false,
  }
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public appConfigCtrl: AppConfig,
    private storageCtrl: Storage,
    private ref: ChangeDetectorRef,
    public app: App,
    private PopoverCtrl: PopoverController,
    public navParams: NavParams,
  ) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    // this.storageCtrl.get('c_account').then((val) => {
    //   this.clientDeliveryInfo.AccountID = val;
    // });
    if (this.navParams.data.item != undefined) {
      console.log(this.navParams.data.item)
      let parmas = this.navParams.data.item;
      this.clientDeliveryInfo.DeliveryAddressId = parmas.deliveryAddressId;
      this.clientDeliveryInfo.AccountID = parmas.accountID;
      this.clientDeliveryInfo.DeliveryName = parmas.deliveryName;
      this.clientDeliveryInfo.DeliveryMobile = parmas.deliveryMobile;
      this.clientDeliveryInfo.ProvinceID = parmas.provinceID;
      this.clientDeliveryInfo.CityID = parmas.cityID;
      this.clientDeliveryInfo.CountyID = parmas.countyID;
      this.clientDeliveryInfo.Address = parmas.address;
      this.clientDeliveryInfo.pccName = parmas.pccName;
      this.clientDeliveryInfo.DeliveryLabel = parmas.deliveryLabel;
      this.clientDeliveryInfo.DeliveryDefault = parmas.deliveryDefault;
      this.clientDeliveryInfo.SCDeliveryDefault = parmas.scDeliveryDefault;
      this.pageedit = true;
    }
    if (navParams.data.imageList != undefined) {
      if (navParams.data.imageList.length > 0) {
        this.imageList = navParams.data.imageList
      }
    }
    this.getRegion();
  }
  ionViewDidEnter() {
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('ShippingaddressPage');
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
    if (this.clientDeliveryInfo.pccName.length < 1) {
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
    let previouspage = localStorage.getItem('previouspage');
    let defaultSC = localStorage.getItem('delivercount');
    if (defaultSC == '0') {
      this.clientDeliveryInfo.DeliveryDefault = true;
    }
    if (previouspage != null) {
      this.clientDeliveryInfo.DeliveryDefault = true;
    }
    let url = '';
    if (this.pageedit) {
      url = AppGlobal.API.postDeliveUpdate;
    } else {
      url = AppGlobal.API.postDelivery;
    }
    console.log(this.clientDeliveryInfo)
    this.appService.httpPost_token(url, this.c_token, this.clientDeliveryInfo, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (previouspage != null) {
          localStorage.clear();
          this.navCtrl.push(previouspage, {
            imageList: this.imageList
          })
        } else {
          this.navCtrl.push('ShippingaddressPage');
        }
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
  selectLocation() {
    console.log('111')
    let popover = this.PopoverCtrl.create('PartLocationOptPage', { page: 'AdminauditinfodetailPage' }, {
      cssClass: 'locationstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != undefined) {
        console.log(data)
        this.clientDeliveryInfo.pccName = data.pccName;
        this.clientDeliveryInfo.ProvinceID = data.ProvinceID;
        this.clientDeliveryInfo.CityID = data.CityId;
        this.clientDeliveryInfo.CountyID = data.CountyId;
        // this.clientDeliveryInfo.provinceId = data.ProvinceID;
        // this.clientDeliveryInfo.cityId = data.CityId;
        // this.clientDeliveryInfo.countyId = data.CountyId;

      }
    });
  }
}
