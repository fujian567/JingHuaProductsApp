import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppStaticConfig, AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';

/**
客户端：找回密码界面
 */

@IonicPage()
@Component({
  selector: 'page-findpwd',
  templateUrl: 'findpwd.html',
})
export class FindpwdPage {
  params = {
    username: '',
    vcode: '',
  }
  FindPwdAllowViewModel: any = {
    Account: '',
    VerificationCode: '',
    NewPassword: '',
    PlatformType_L: '2'
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
  ) { }
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
  VerifyViewModel: any = {
    MobileNum: '',
    VerifyType: '2'
  }
  postverify() {
    this.verifyCode.disable = false;
    this.verifyCode.username_disable = false;
    this.VerifyViewModel.MobileNum = this.FindPwdAllowViewModel.Account;
    this.appService.httpPost(AppGlobal.API.postVerification, this.VerifyViewModel, rs => {
      if (rs.isSuccess) {
        this.appConfigCtrl.popToastView('验证码已发送');
        //发送验证码成功后开始倒计时

        this.settime();
      } else {
        this.appConfigCtrl.popAlertView('验证码发送失败，请检查您的网络是否联通。');
      }
    })
  }
  getCode() {
    if (!AppStaticConfig.verifyMobile(this.FindPwdAllowViewModel.Account)) {
      this.appConfigCtrl.popAlertView('请填写正确手机号');
      return;
    }
    this.postverify();
  }
  getinput(event: KeyboardEvent) {
    if (this.FindPwdAllowViewModel.Account.length > 5 && this.FindPwdAllowViewModel.Account.length <= 10) {
      this.verifyCode.color = 'danger';
      this.verifyCode.outline = true;
    } else if (this.FindPwdAllowViewModel.Account.length > 10) {
      this.verifyCode.color = 'danger';
      this.verifyCode.outline = false;
      this.verifyCode.disable = true;
    } else {
      this.verifyCode.color = 'verify';
      this.verifyCode.outline = false;
      this.verifyCode.disable = false;
      this.verifyCode.btn_disable = false;
    }
  }
  getblur() {
    if (this.FindPwdAllowViewModel.Account.length == 0) {
      this.verifyCode.color = 'verify';
      this.verifyCode.outline = false;
      this.verifyCode.disable = false;
    }
  }
  getinputpwd(event: KeyboardEvent) {
    if (this.FindPwdAllowViewModel.NewPassword.length > 5) {
      this.verifyCode.btn_disable = true;
      this.verifyCode.btn_color = 'danger';
    } else {
      this.verifyCode.btn_color = 'verify';
      this.verifyCode.btn_disable = false;
    }
  }
  getblurpwd() {
    if (this.FindPwdAllowViewModel.NewPassword.length == 0) {
      this.verifyCode.btn_color = 'verify';
      this.verifyCode.btn_disable = false;
    }
  }
  postNewPwd() {
    this.appService.httpPost(AppGlobal.API.postFindRestPwd, this.FindPwdAllowViewModel, rs => {
      if (rs.isSuccess) {
        this.appConfigCtrl.popAlertView('修改成功，请重新你登录')
        this.navCtrl.setRoot('LoginPage');
      } else {
        console.log(rs)
        this.appConfigCtrl.popAlertView('修改失败，请检查您的验证码是否正确，稍后再试！');
      }
    }, true)
  }
  resetpwd() {
    if (this.FindPwdAllowViewModel.Account == "") {
      this.appConfigCtrl.popAlertView('请填写手机号');
      return
    } else if (this.FindPwdAllowViewModel.VerificationCode == "") {
      this.appConfigCtrl.popAlertView('请填写验证码');
      return
    } else if (this.FindPwdAllowViewModel.NewPassword == "") {
      this.appConfigCtrl.popAlertView('请填写新密码');
      return
    } else {
      this.postNewPwd();
    }
  }
}