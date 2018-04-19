import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';


/**
 客户端：登录界面
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
@Injectable()
export class LoginPage {
  params = {
    username: '',
    password: '',
  }
  LandingViewModel = {
    Account: '',
    PassWord: '',
    PlatformType_L: '1'
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public app: App,
    private storage: Storage) {
    this.storage.get('c_token').then((val) => {
      if (val != null) {
        this.accountStatus(val);
      }
    });
  }
  accountStatus(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getAccountStatus, c_token, {}, rs => {
      if (rs.objectData == '0') {
        this.app.getRootNav().setRoot('AccpuntinformationPage');
      } else if (rs.objectData == '1') {
        this.navCtrl.setRoot('TabsPage');
      } else if (rs.objectData == '2') {
        this.navCtrl.setRoot('InfoauditPage', {
          auditStatus: true
        });
      } else if (rs.objectData == '-1') {
        this.appConfigCtrl.popAlertView('您的账户已被停用，请联系客服进行咨询！');
      } else if (rs.objectData == '-2') {
        this.appConfigCtrl.popAlertView('您的账户状态异常，请联系客服进行咨询！');
      }
    })
  }
  logincallback() {
    this.LandingViewModel.Account = this.params.username;
    this.LandingViewModel.PassWord = this.params.password;
    this.appService.httpPostlogin(AppGlobal.API.postlogin, this.LandingViewModel, rs => {
      console.log(rs)
      if (rs.isSuccess) {
        this.storage.ready().then(() => {
          this.storage.set('c_token', rs.objectData.authorization);
          this.storage.set('c_accountState', rs.objectData.accountState_L);
          this.storage.set('c_logDateTime', rs.objectData.logDateTime);
          this.storage.set('c_account', rs.objectData.accountID);
          this.storage.set('c_accountRoles', rs.objectData.accountRoles);
          this.storage.set('c_platformType', rs.objectData.platformTypeID);
        });
        if (rs.objectData.accountState_L == '0') {
          this.app.getRootNav().setRoot('AccpuntinformationPage');
        } else if (rs.objectData.accountState_L == '1') {
          this.navCtrl.setRoot('TabsPage');
        } else if (rs.objectData.accountState_L == '-1') {
          this.appConfigCtrl.popAlertView('您的账户已被停用，请联系客服进行咨询！');
        } else if (rs.objectData.accountState_L == '-2') {
          this.appConfigCtrl.popAlertView('您的账户状态异常，请联系客服进行咨询！');
        } else if (rs.objectData.accountState_L == '2') {
          this.app.getRootNav().setRoot('InfoauditPage', {
            auditStatus: true
          });
        }
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
  logIn() {
    if (this.params.username.length == 0) {
      this.appConfigCtrl.popAlertView('请输入你的账户名');
    } else if (this.params.password.length == 0) {
      this.appConfigCtrl.popAlertView('请输入你的密码');
    } else {
      this.logincallback();
    }
  }
  register() {
    this.navCtrl.push('RegisterPage');
  }
  findpwd() {
    this.navCtrl.push('FindpwdPage');
  }
}
