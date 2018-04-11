import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：售后服务
 */

@IonicPage()
@Component({
  selector: 'page-aftersale',
  templateUrl: 'aftersale.html',
})
export class AftersalePage {
  c_token: any;
  orderinfo: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  pagedatamodle: any =
    {
      ordernum: '123456789',
      goodsId: '5',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '130',
      goodsImg: './../../assets/imgs/nnxls.jpg',
      isCheck: false,
      reason: '',
      deliveryInfoMobile: '',
      deliveryInfoName: '',
    }
  orderRefundViewModel: any = {
    OrderId: '',
    OrderRefundContent: ''
  }
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    private PopoverCtrl: PopoverController,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (this.navParams.data.item != undefined) {
      this.orderinfo = this.navParams.data.item;
      this.orderRefundViewModel.OrderId = this.orderinfo.orderId;
      this.pagedatamodle.ordernum = this.orderinfo.orderCode;
      this.pagedatamodle.goodsName = this.orderinfo.paramsInfo[0].commName;
      this.pagedatamodle.goodsSpec = this.orderinfo.paramsInfo[0].commSpecName;
      this.pagedatamodle.goodsImg = this.orderinfo.paramsInfo[0].productImageData;
      this.pagedatamodle.deliveryInfoMobile = this.orderinfo.orderDeliveryAddressInfo.deliveryInfoMobile;
      this.pagedatamodle.deliveryInfoName = this.orderinfo.orderDeliveryAddressInfo.deliveryInfoName;
      console.log(this.orderinfo)
    }
  }

  selectReason() {
    let popover = this.PopoverCtrl.create('PartAftersalePage', { test: '111' }, {
      cssClass: 'reason',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 500 });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.pagedatamodle.reason = data
        console.log(data)
      }
    });
  }
  returnApply() {
    if (this.pagedatamodle.reason.length < 1) {
      this.appConfigCtrl.popAlertView('请选择退货理由');
      return;
    }
    this.orderRefundViewModel.OrderRefundContent = this.pagedatamodle.reason
    this.appService.httpPost_token(AppGlobal.API.postReturnApply, this.c_token, { ordersrefund: this.orderRefundViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.setRoot('OrderdetailPage',{orderId:this.orderRefundViewModel.OrderId, c_token: this.c_token});
      }
    },true)
  }
}
