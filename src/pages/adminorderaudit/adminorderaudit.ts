import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：订单审核界面
 */

@IonicPage()
@Component({
  selector: 'page-adminorderaudit',
  templateUrl: 'adminorderaudit.html',
})
export class AdminorderauditPage {
  u_token: any;
  pagedatamodle: any = {
    orderNumber: '',
    payMethodName: '',
    distributionInfoName: '',
    address: '',
    deliveryInfoName: '',
    deliveryInfoMobile: '',
    freightAmount: '',
    orderAmount: '',
    orderStateId: '',
    voucherImg: '',
    invoiceTypeId: '',
    orderInvoiceHeader: '',
    orderInvoiceContent: '',
    orderInvoiceMobile: '',
    orderInvoiceEmail: '',
    invoiceTypeName: '',
    enterpriseName: '',
    taxIdeNumber: ''
  }
  goodsList: any = [];
  orderid: any = '';
  orderaudit: any = {
    OrderId: '',
    IsAudit: '',
    AuditContent: '',
  }
  constructor(
    public navCtrl: NavController,
    public imageViewerCtrl: ImageViewerController,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    public app: App,
    public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
    if (this.navParams.data.orderId != undefined) {
      this.orderid = this.navParams.data.orderId;
      this.getOrderDetail(this.orderid, this.navParams.data.u_token)
    }
  }
  getOrderDetail(orderid: any, u_token: any) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByID, u_token, { orderid: orderid }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          console.log(rs)
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
            this.pagedatamodle.voucherImg = AppGlobal.domainimage + rs.objectData[i].imagesList[0].imagePath + rs.objectData[i].imagesList[0].imageName;
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
            this.orderaudit.OrderId = rs.objectData[i].orderId;
          }
        }
      }
    });
  }

  showOriginal(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage, {
      enableBackdropDismiss: true
    });
    imageViewer.present();
  }
  noAudit() {
    this.appConfig.popPromptView('', 'alert-bg-c', '请输入审核不通过的原因，供用户参考', 'reason', '输入审核不通过的原因', rt => {
      if (rt.reason.length < 2) {
        this.appConfig.popAlertView('请输入审核不通过的原因');
        return;
      }
      this.orderaudit.IsAudit = false;
      this.orderaudit.AuditContent = rt.reason;
      this.appService.httpPost_token(AppGlobal.API.postAuditOrder, this.u_token, { orderaudit: this.orderaudit }, rs => {
        console.log(rs)
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.navCtrl.push('AdminorderPage');
        } else {
          this.appConfig.popAlertView(rs.errorMessage);
        }
      }, true)
    })
  }
  audit() {
    this.orderaudit.IsAudit = true;
    this.orderaudit.AuditContent = '审核通过';
    this.appService.httpPost_token(AppGlobal.API.postAuditOrder, this.u_token, { orderaudit: this.orderaudit }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('AdminorderPage');
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    }, true)
  }
}
