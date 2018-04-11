import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：退货管理
 */

@IonicPage()
@Component({
  selector: 'page-adminordersalesreturn',
  templateUrl: 'adminordersalesreturn.html',
})
export class AdminordersalesreturnPage {
  u_token: any;
  dependentColumns: any[] = [];
  pagedatamodle: any = {
    orderNumber: '',
    freightAmount: '',
    orderAmount: '',
    orderStateId: '',
  }
  goodsList: any = [];
  processMainId: any = '';
  pageSubimtModel: any = {
    OrderId:'',
    OrderLogisticsNumber: '',
    OrderCourierCompanyCode: '',
    OrderCourierCompanyName: '',
  }
  constructor(
    public navCtrl: NavController, 
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
    if (this.navParams.data.processMainId != undefined) {
      this.processMainId = this.navParams.data.processMainId;
      this.pageSubimtModel.OrderId=this.navParams.data.orderId;
      this.getOrderDetail(this.processMainId, this.navParams.data.u_token)
    }
  }
  getOrderDetail(processMainId: any, u_token: any) {
    this.appService.httpPost_token(AppGlobal.API.getRefundWaitAuditOrderInfo, u_token, { processmainid: processMainId }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        console.log(rs)
        if (rs.objectData.length > 0) {
          for (let i = 0; i < rs.objectData.length; i++) {
            // this.pagedatamodle.ordernum = rs.objectData[i].orderCode;
            // this.pagedatamodle.payMethodName = rs.objectData[i].payMethodName;
            // this.pagedatamodle.orderAmount = rs.objectData[i].orderAmount;
            // this.pagedatamodle.freightAmount = rs.objectData[i].freightAmount;
            // this.pagedatamodle.orderStateId = rs.objectData[i].orderStateId;
            // this.pagedatamodle.orderNumber = rs.objectData[i].orderNumber;
            // this.goodsList = rs.objectData[i].paramsInfo;
          }
        }
      }
    });
  }
  noAudit() {
    this.appConfig.popPromptView('', 'alert-bg-c', '请输入不同意退货的原因，供用户参考', 'reason', '输入审核不通过的原因', rs => {

      // this.appService.httpPost_token(AppGlobal.API.postFbenterpriseSubmit, this.u_token, this.FBAuditViewModel, rs => {
      //   console.log(rs)
      //   if (rs.status == 401 || rs.status == 403) {
      //     this.app.getRootNav().setRoot('AdminloginPage');
      //   }
      //   if (rs.isSuccess) {
      //     this.navCtrl.setRoot('AdminauditinfolistPage');
      //   } else {
      //     this.appConfig.popAlertView('网络错误，请稍后再试！')
      //   }
      // },true)
    })
  }
  audit() {

  }
}
