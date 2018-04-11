import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：价格管理界面
 */

@IonicPage()
@Component({
  selector: 'page-admingoodprice',
  templateUrl: 'admingoodprice.html',
})
export class AdmingoodpricePage {
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  u_token: any;
  pageModel: any = {
    image: '',
    name: '',
    price: '',
    spec: '',
    approval: '',
    CompanyName: '',
    CompanyAddress: '',
    otherName: ''
  }
  PagesInfoViewModel: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 34
  }
  CommParamId: any;
  popPageParmas: any;
  locationPrice: any = [];
  dataParmas: any;
  alreadyItemID: any = [];
  constructor(

    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storage: Storage,
    public app: App,
    public navParams: NavParams) {

    this.dataParmas = this.navParams.data.item;
    console.log(this.dataParmas)
    if (this.dataParmas != undefined) {
      this.pageModel.image = this.navParams.data.defaultImg;
      this.pageModel.name = this.dataParmas.item.commName;
      this.pageModel.otherName = this.dataParmas.item.commAlias;
      this.pageModel.spec = this.dataParmas.item.commSpecName;
      this.pageModel.approval = this.dataParmas.item.approvedNumName;
      this.pageModel.CompanyName = this.dataParmas.item.enterprisesName;
      this.pageModel.CompanyAddress = this.dataParmas.item.address;
      this.pageModel.price = this.dataParmas.item.medianPrice
      this.CommParamId = this.dataParmas.item.commParamId;
      this.storage.get('u_token').then((val) => {
        this.u_token = val;
        this.getLocationPrice(val);
      });
    } else {
      this.navCtrl.setRoot('AdmingoodpricelistPage');
    }
  }
  getLocationPrice(u_token) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsPriceInfo, u_token, { commParamId: this.CommParamId, pages: this.PagesInfoViewModel }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.locationPrice = rs.objectData;
          this.alreadyItemID=[]
          for (let i = 0; i < rs.objectData.length; i++) {
            this.alreadyItemID.push(rs.objectData[i].provinceId)
          }
        }
      }
    })
  }
  addtionprice() {
    console.log( this.alreadyItemID)
    let popover = this.popoverCtrl.create('AdminPartLocationpricePage', { popPageParmas: this.popPageParmas, alreadyItemID: this.alreadyItemID }, {
      cssClass: 'pricestyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present();
    popover.onDidDismiss((data) => {
      if (data != undefined) {
        this.subimtData(data);
      }
    });
  }
  deleteParmas(item: any) {
    this.appConfigCtrl.popAlertConfirmView('你确定要删除该价格吗？', '我在考虑下', '立刻删除', () => {
      this.appService.httpPost_token(AppGlobal.API.getGoodsPriceDet, this.u_token, { priceId:item.priceId }, rs => {
        if (rs.status === 401 || rs.status === 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.getLocationPrice(this.u_token);
        } else {
          this.appConfigCtrl.popAlertView('删除失败，请稍后重试或者联系管理员！');
        }
      }, true)
    });
  }
  subimtData(submitData: any) {
    let submitArray: any = [];
    if(submitData!=undefined){
      for (let i = 0; i < submitData.selectLocatioObj.length; i++) {
        let ProductRegionalPrice: any = {
          PriceId: this._guid,
          CommParamId: this.CommParamId,
          ProvinceId: submitData.selectLocatioObj[i].itemid,
          CityId: '000000',
          CountyId: '000000',
          RegionalClassId: submitData.selectLocatioObj[i].rclassId,
          PriceTypeId: '2',
          PriceCreateDate: '2018-4-08',
          PriceDec: submitData.selectLocatioObj[i].name,
          RegionalPrice: submitData.price,
          IsEffective: true
        }
        submitArray.push(ProductRegionalPrice)
      }
      this.appService.httpPost_token(AppGlobal.API.postGoodsPrice, this.u_token, { productPrice: submitArray }, rs => {
        if (rs.status === 401 || rs.status === 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.getLocationPrice(this.u_token);
        }
      }, true)
    }
  }
}

