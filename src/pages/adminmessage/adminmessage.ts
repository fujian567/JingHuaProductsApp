import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：群发消息
 */

@IonicPage()
@Component({
  selector: 'page-adminmessage',
  templateUrl: 'adminmessage.html',
})
export class AdminmessagePage {
  u_token: any;
  MsgViewModel: any = {
    AlertTitle: '',
    AlertInfo: '',
    SendTitle: '',
    SendContent: '',
    MsgMark: '',
    TargetAccountId: 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9',
    MsgTypeId: 1,//1、群发，2端对端
    ExtrasData: 'BC6D7078-4603-41D3-9706-0AB4E3CA4880',
    ExtrasType: '1',//0、是资料审核，1、订单
    Audience: 'APP设备标识',
    MsgId: 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9'
  }
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    private appConfigCtrl: AppConfig,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
  }

  comment() {
    console.log(this.MsgViewModel)
    if (this.MsgViewModel.AlertTitle.length < 1) {
      this.appConfigCtrl.popAlertView('请输入消息标题');
      return;
    }
    if (this.MsgViewModel.AlertInfo.length < 1) {
      this.appConfigCtrl.popAlertView('请输入消息内容');
      return;
    }
    this.MsgViewModel.SendTitle = this.MsgViewModel.AlertTitle;
    this.MsgViewModel.SendContent = this.MsgViewModel.AlertInfo;
    this.appService.httpPost_token(AppGlobal.API.postCustomerMsgjpush, this.u_token, { msg: this.MsgViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('AdminhomePage');
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
}
