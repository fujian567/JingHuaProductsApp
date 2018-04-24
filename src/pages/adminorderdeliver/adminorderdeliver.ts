import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
 管理端：订单发货界面
 */

@IonicPage()
@Component({
  selector: 'page-adminorderdeliver',
  templateUrl: 'adminorderdeliver.html',
})
export class AdminorderdeliverPage {
  u_token: any;
  dependentColumns: any[] = [];
  pagedatamodle: any = {
    orderNumber: '',
    freightAmount: '',
    orderAmount: '',
    orderStateId: '',
  }
  goodsList: any = [];
  orderid: any = '';
  pageSubimtModel: any = {
    OrderId: '',
    OrderLogisticsNumber: '',
    OrderCourierCompanyCode: '',
    OrderCourierCompanyName: '',
  }
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    private ref: ChangeDetectorRef,
    public app: App,
    public navParams: NavParams) {
    this.getExpress();
  }
  ionViewWillEnter() {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
    if (this.navParams.data.orderId != undefined) {
      this.orderid = this.navParams.data.orderId;
      this.pageSubimtModel.OrderId = this.navParams.data.orderId;
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
          for (let i = 0; i < rs.objectData.length; i++) {
            this.pagedatamodle.ordernum = rs.objectData[i].orderCode;
            this.pagedatamodle.payMethodName = rs.objectData[i].payMethodName;
            this.pagedatamodle.orderAmount = rs.objectData[i].orderAmount;
            this.pagedatamodle.freightAmount = rs.objectData[i].freightAmount;
            this.pagedatamodle.orderStateId = rs.objectData[i].orderStateId;
            this.pagedatamodle.orderNumber = rs.objectData[i].orderNumber;
            this.goodsList = rs.objectData[i].paramsInfo;
          }
        }
      }
    });
  }
  getExpress() {
    this.appService.geteExpressContact()
      .subscribe(rs => {
        let OrderCourierCompanyCode = rs.json();
        let options: Array<any> = [];
        for (let i = 0; i < OrderCourierCompanyCode.length; i++) {
          let optionsitem = {
            text: '',
            value: ''
          }
          optionsitem.text = OrderCourierCompanyCode[i].CourierCompany;
          optionsitem.value = OrderCourierCompanyCode[i].CourierCode;
          options.push(optionsitem);
        }
        let tempobj: any = {
          options: ''
        };
        tempobj.options = options;
        this.dependentColumns.push(tempobj);
        this.ref.detectChanges();
      }, error => {
        console.log(error);
      });
  }
  publish() {
    if (this.pageSubimtModel.OrderLogisticsNumber.length < 2) {
      this.appConfig.popAlertView('请填写正确的运单号！')
    } else if (this.pageSubimtModel.OrderCourierCompanyCode.length < 1) {
      this.appConfig.popAlertView('请选择快递公司！')
    } else {
      this.pageSubimtModel.OrderCourierCompanyName = document.getElementById('expressname').textContent.trim();
      this.appService.httpPost_token(AppGlobal.API.postDeliveryOrder, this.u_token, { ordersdelivery: this.pageSubimtModel }, rs => {
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          let alertInfo=`你的订单${this.pagedatamodle.ordernum}已发货,快递公司：${this.pageSubimtModel.OrderCourierCompanyName}，运单号：
          ${this.pageSubimtModel.OrderLogisticsNumber}`;
          this.jpushMesaage('您的订单已发货', alertInfo, this.pageSubimtModel.OrderId)
          this.navCtrl.setRoot('AdminorderPage');
        } else {
          this.appConfig.popAlertView(rs.errorMessage);
        }
      }, true)
    }
  }
  jpushMesaage(alertTitle: any, alertInfo: any, fbusinessId: any) {
    let MsgViewModel: any = {
      AlertTitle: '',
      AlertInfo: '',
      SendTitle: '',
      SendContent: '',
      MsgMark: '',
      TargetAccountId: fbusinessId,//根据orderid获取AccountId
      MsgTypeId: 2,//1、群发，2端对端
      ExtrasData: 'BC6D7078-4603-41D3-9706-0AB4E3CA4880',
      ExtrasType: '1',//0、是资料审核，1、订单
      Audience: 'APP设备标识',
      MsgId: 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9'
    }
    MsgViewModel.AlertTitle = alertTitle;
    MsgViewModel.AlertInfo = alertInfo;
    MsgViewModel.SendTitle = alertTitle;
    MsgViewModel.SendContent = alertInfo;
    this.appService.httpPost_token(AppGlobal.API.postCustomerMsgjpush, this.u_token, { msg: MsgViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('AdminhomePage');
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    })
  }
}
