import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：订单详情
 */

@IonicPage()
@Component({
  selector: 'page-orderdetail',
  templateUrl: 'orderdetail.html',
})
export class OrderdetailPage {
  c_token:any;
  pagedatamodle: any = {
    ordernum: '',
    payMethodName: '',
    distributionInfoName: '',
    address: '',
    deliveryInfoName: '',
    deliveryInfoMobile: '',
    freightAmount: '',
    orderAmount: '',
    payAmount:'',
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
    orderCreateDate:'',
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
            this.pagedatamodle.distributionInfoName = rs.objectData[i].distributionInfoName;
            this.pagedatamodle.freightAmount = rs.objectData[i].freightAmount;
            this.pagedatamodle.orderStateId = rs.objectData[i].orderStateId;
            this.pagedatamodle.orderNumber = rs.objectData[i].orderNumber;
            this.pagedatamodle.address = rs.objectData[i].orderDeliveryAddressInfo.pccname + ' ' + rs.objectData[i].orderDeliveryAddressInfo.address;
            this.pagedatamodle.deliveryInfoName = rs.objectData[i].orderDeliveryAddressInfo.deliveryInfoName;
            this.pagedatamodle.deliveryInfoMobile = rs.objectData[i].orderDeliveryAddressInfo.deliveryInfoMobile;
            this.pagedatamodle.voucherImg = rs.objectData[i].imagesList[0].imageData;
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
            this.pagedatamodle.orderCreateDate= rs.objectData[i].orderCreateDate;
            this.pagedatamodle.payAmount= rs.objectData[i].payAmount;
            
          }
        }
      }
    },true);
  }
  callService() {
    this.callNumber.callNumber(AppGlobal.systemPhone.servicePhone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }



}
