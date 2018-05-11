import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppStaticConfig, AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
/**
客户端：修改密码界面
 */

@IonicPage()
@Component({
  selector: 'page-modifypwd',
  templateUrl: 'modifypwd.html',
})
export class ModifypwdPage {
  FindPwdViewModel: any = {
    AccountID: '',
    Account: '',
    VerificationCode: '',
    NewPassword: '',
  }
  c_token: any;
  VerifyViewModel: any = {
    MobileNum: '',
    VerifyType: '2'
  }
  // 验证码倒计时
  verifyCode: any = {
    verifyCodeTips: '获取验证码',
    countdown: 120,
    disable: false,
    color: 'verify',
    outline: false,
    btn_color: 'verify',
    username_disable: true,
    btn_disable: false
  }
  constructor(
    public navCtrl: NavController,
    private storageCtrl: Storage,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public app: App,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    this.storageCtrl.get('c_account').then((val) => {
      this.FindPwdViewModel.AccountID = val;
    });
  }
  // 倒计时
  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 120;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      this.verifyCode.username_disable = true;
      return;
    } else {
      this.verifyCode.countdown--;
    }
    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
      this.settime();
    }, 1000);
  }
  getinput(event: KeyboardEvent) {
    if (this.FindPwdViewModel.Account.length > 5 && this.FindPwdViewModel.Account.length <= 10) {
      this.verifyCode.color = 'danger';
      this.verifyCode.outline = true;
    } else if (this.FindPwdViewModel.Account.length > 10) {
      this.verifyCode.color = 'danger';
      this.verifyCode.outline = false;
      this.verifyCode.disable = true;
    } else {
      this.verifyCode.color = 'verify';
      this.verifyCode.outline = false;
      this.verifyCode.disable = false;
    }
  }
  getblur() {
    if (this.FindPwdViewModel.Account.length == 0) {
      this.verifyCode.color = 'verify';
      this.verifyCode.outline = false;
      this.verifyCode.disable = false;
    }
  }
  getinputpwd(event: KeyboardEvent) {
    if (this.FindPwdViewModel.NewPassword.length > 5) {
      this.verifyCode.btn_disable = true;
      this.verifyCode.btn_color = 'danger';
    } else {
      this.verifyCode.btn_color = 'verify';
      this.verifyCode.btn_disable = false;
    }
  }
  getblurpwd() {
    if (this.FindPwdViewModel.NewPassword.length == 0) {
      this.verifyCode.btn_color = 'verify';
      this.verifyCode.btn_disable = false;
    }
  }
  postverify() {
    this.verifyCode.disable = false;
    this.verifyCode.username_disable = false;
    this.VerifyViewModel.MobileNum = this.FindPwdViewModel.Account;
    this.appService.httpPost(AppGlobal.API.postVerification, this.VerifyViewModel, rs => {
      if (rs.isSuccess) {
        this.appConfigCtrl.popToastView('验证码已发送');
        //发送验证码成功后开始倒计时

        this.verifyCode.disable = false;
        this.verifyCode.username_disable = false;
        this.settime();
      } else {
        this.verifyCode.disable = true;
        this.verifyCode.username_disable = true;
        this.appConfigCtrl.popAlertView('验证码发送失败，请检查您的网络是否联通。');
      }
    })
  }
  getCode() {
    if (!AppStaticConfig.verifyMobile(this.FindPwdViewModel.Account)) {
      this.appConfigCtrl.popAlertView('请填写正确手机号');
      return;
    }
    this.postverify();
  }
  postNewPwd() {
    this.appService.httpPost_token(AppGlobal.API.postClientRestPwd, this.c_token, this.FindPwdViewModel, rs => {
      if (rs.isSuccess) {
        this.appConfigCtrl.popAlertView('修改成功，请重新登录')
        this.storageCtrl.clear();
        this.app.getRootNav().setRoot('LoginPage');
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
        console.log(rs)
      }
    }, true)
  }
  resetpwd() {
    if (this.FindPwdViewModel.Account == "") {
      this.appConfigCtrl.popAlertView('请填写手机号');
      return
    } else if (this.FindPwdViewModel.VerificationCode == "") {
      this.appConfigCtrl.popAlertView('请填写验证码');
      return
    } else if (this.FindPwdViewModel.NewPassword == "") {
      this.appConfigCtrl.popAlertView('请填写新密码');
      return
    } else {
      this.postNewPwd();
    }
  }
}
