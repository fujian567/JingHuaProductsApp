import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
declare var cordova: any;
/**
客户端：未支付订单详情
 */

@IonicPage()
@Component({
  selector: 'page-nopaydetail',
  templateUrl: 'nopaydetail.html',
})
export class NopaydetailPage {
  c_token: any;
  imageUrl = AppGlobal.domainimage;
  isShowVoucherImg: boolean = false;
  wxPayMethod: boolean = false;
  aliPayMethod: boolean = true;
  PayMethodId: any = 1;
  PayMethodName: any = '支付宝';
  //支付宝支付modle
  alipayOrderInfoViewModel: any = {
    AlipayBody: '',
    AlipaySubject: '',
    AlipayTotalAmount: '',
    AlipayOutTradeNo: '',
    AlipayProductCode: ''
  }
  pagedatamodle: any = {
    ordernum: '',
    payMethodName: '',
    distributionInfoName: '',
    address: '',
    deliveryInfoName: '',
    deliveryInfoMobile: '',
    freightAmount: '',
    orderAmount: '',
    payAmount: '',
    orderStateId: '',
    voucherImg: '',
    invoiceTypeId: '',
    orderInvoiceHeader: '',
    orderInvoiceContent: '',
    orderInvoiceMobile: '',
    orderInvoiceEmail: '',
    invoiceTypeName: '',
    enterpriseName: '',
    taxIdeNumber: '',
    orderCreateDate: '',
  }
  goodsList: any = [];
  orderid: any = '';
  constructor(
    public navCtrl: NavController,
    private callNumber: CallNumber,
    public imageViewerCtrl: ImageViewerController,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    public app: App,
    public navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (this.navParams.data.orderId != undefined) {
      this.orderid = this.navParams.data.orderId;
      this.getOrderDetail(this.orderid, this.navParams.data.c_token)
    }
  }
  getOrderDetail(orderid: any, c_token: any) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByID, c_token, { orderid: orderid }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        console.log(rs.objectData)
        if (rs.objectData.length > 0) {
          for (let i = 0; i < rs.objectData.length; i++) {
            this.pagedatamodle.ordernum = rs.objectData[i].orderCode;
            this.pagedatamodle.payMethodName = rs.objectData[i].payMethodName;
            this.pagedatamodle.orderAmount = rs.objectData[i].orderAmount;
            this.pagedatamodle.payAmount = rs.objectData[i].payAmount;
            this.pagedatamodle.distributionInfoName = rs.objectData[i].distributionInfoName;
            this.pagedatamodle.freightAmount = rs.objectData[i].freightAmount;
            this.pagedatamodle.orderStateId = rs.objectData[i].orderStateId;
            this.pagedatamodle.orderNumber = rs.objectData[i].orderNumber;
            this.pagedatamodle.address = rs.objectData[i].orderDeliveryAddressInfo.pccname + ' ' + rs.objectData[i].orderDeliveryAddressInfo.address;
            this.pagedatamodle.deliveryInfoName = rs.objectData[i].orderDeliveryAddressInfo.deliveryInfoName;
            this.pagedatamodle.deliveryInfoMobile = rs.objectData[i].orderDeliveryAddressInfo.deliveryInfoMobile;
            this.pagedatamodle.voucherImg = rs.objectData[i].imagesList;
            this.goodsList = rs.objectData[i].paramsInfo;
            this.pagedatamodle.invoiceTypeId = rs.objectData[i].invoiceTypeId;
            this.pagedatamodle.orderInvoiceInfo = rs.objectData[i].orderInvoiceInfo.isPInvoice;
            this.pagedatamodle.invoiceTypeName = rs.objectData[i].orderInvoiceInfo.invoiceTypeName;
            this.pagedatamodle.orderInvoiceHeader = rs.objectData[i].orderInvoiceInfo.orderInvoiceHeader;
            this.pagedatamodle.orderInvoiceContent = rs.objectData[i].orderInvoiceInfo.orderInvoiceContent;
            this.pagedatamodle.orderInvoiceMobile = rs.objectData[i].orderInvoiceInfo.orderInvoiceMobile;
            this.pagedatamodle.orderInvoiceEmail = rs.objectData[i].orderInvoiceInfo.orderInvoiceEmail;
            this.pagedatamodle.taxIdeNumber = rs.objectData[i].orderInvoiceInfo.taxIdeNumber;
            this.pagedatamodle.enterpriseName = rs.objectData[i].orderInvoiceInfo.enterpriseName;
            if (rs.objectData[i].payMethodName == '银行转账') {
              this.isShowVoucherImg = true
            }
          }
        }
      }
    }, true);
  }
  callService() {
    this.callNumber.callNumber(AppGlobal.systemPhone.servicePhone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  wxPayCheck() {
    this.aliPayMethod = false;
    this.PayMethodId = 2;
    this.PayMethodName = '微信支付'
    this.wxPayMethod = true;
  }
  aliPayCheck() {
    this.wxPayMethod = false;
    this.PayMethodId = 1;
    this.PayMethodName = '支付宝';
    this.aliPayMethod = true;
  }
  //支付宝
  settlement() {
    this.alipayOrderInfoViewModel.AlipayBody = '精华直销B2B订单号：' +  this.pagedatamodle.ordernum;
    this.alipayOrderInfoViewModel.AlipaySubject = '精华直销B2B订单号：' +  this.pagedatamodle.ordernum;
    this.alipayOrderInfoViewModel.AlipayTotalAmount = this.pagedatamodle.payAmount;
    this.alipayOrderInfoViewModel.AlipayOutTradeNo = this.orderid;
    this.alipayOrderInfoViewModel.AlipayProductCode = this.orderid;
    this.appService.httpPost_token(AppGlobal.API.getpostOrderInfoAlipay, this.c_token, { orderInfoalipay: this.alipayOrderInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        this.alipay(rs.objectData)
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    }, true);
  }
  alipay(data) {
    let payInfo = AppStaticConfig.unescapeHTML(data);
    cordova.plugins.alipay.payment(payInfo, (success) => {
      if (success.resultStatus == "9000") {
        //支付成功
        this.navCtrl.setRoot('OrdersuccessPage')
      }
      //success.resultStatus==="9000"?this.paySuccess(sn): this.payFailed();

      //this.paySuccess();
    }, (error) => {
      //支付失败
      //this.payFailed();
    });
  }
}
