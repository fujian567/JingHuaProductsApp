import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
管理端：登录界面
 */

@IonicPage()
@Component({
  selector: 'page-adminlogin',
  templateUrl: 'adminlogin.html',
})
export class AdminloginPage {
  UsersLoginViewModel = {
    AccountName: '',
    AccountPwd: '',
    PlatformType_L: '2',
    SalesmanCode: '业务员'
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public app: App,
    private storage: Storage) {
    this.storage.get('u_token').then((val) => {
      if (val != null) {
        this.accountStatus(val);
      }
    });
  }
  accountStatus(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getAccountStatus, u_token, {}, rs => {
      if (rs.objectData == '0') {
        this.appConfigCtrl.popAlertView('您的账户状态异常，请管理员进行联系！');
      } else if (rs.objectData == '1') {
        this.navCtrl.setRoot('AdminhomePage');
      } else if (rs.objectData == '2') {
        this.appConfigCtrl.popAlertView('您的账户状态异常，请管理员进行联系！');
      } else if (rs.objectData == '-1') {
        this.appConfigCtrl.popAlertView('您的账户已被停用，请联系客服进行咨询！');
      } else if (rs.objectData == '-2') {
        this.appConfigCtrl.popAlertView('您的账户状态异常，请联系客服进行咨询！');
      }
    })
  }
  loginCallback() {
    this.appService.httpPostlogin(AppGlobal.API.postUeserlogin, this.UsersLoginViewModel, rs => {
      if (rs.isSuccess) {
        this.storage.ready().then(() => {
          console.log(rs);
          this.storage.set('u_token', rs.objectData.authorization);
          this.storage.set('u_accountState', rs.objectData.accountState_L);
          this.storage.set('u_logDateTime', rs.objectData.logDateTime);
          this.storage.set('u_clientName', rs.objectData.clientName);
          this.storage.set('u_accountName', rs.objectData.accountName);
          this.storage.set('u_salesmanCode', rs.objectData.salesmanCode);
        });
        this.navCtrl.setRoot('AdminhomePage');
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
  logIn() {
    if (this.UsersLoginViewModel.AccountName.length == 0) {
      this.appConfigCtrl.popAlertView('请输入你的账户名');
    } else if (this.UsersLoginViewModel.AccountPwd.length == 0) {
      this.appConfigCtrl.popAlertView('请输入你的密码');
    } else if (this.UsersLoginViewModel.SalesmanCode.length == 0) {
      this.appConfigCtrl.popAlertView('请输入你的业务编码');
    } else {
      this.loginCallback()
    }
  }
  findpwd() {
    this.navCtrl.push('FindpwdPage');
  }
}
