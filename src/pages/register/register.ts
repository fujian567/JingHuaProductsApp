import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：注册界面
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    private appConfigCtrl: AppConfig,
    private storage: Storage
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  pageModel = {
    Account: '',
    PassWord: '',
    rePassWord_M: '',
    ClientName: '',
    Mobile: '',
    CompanyName: '',
    SalesmanCode: '',
    Verification: ''
  }
  //验证手机号是否存在
  isMobile: boolean = false;
  // 页面配置
  pageConfig: any = {
    verifyCodeTips: '获取验证码',
    countdown: 120,
    disable: false,
    color: 'verify',
    outline: false,
    btn_color: 'verify',
    account_disable: true,
    btn_disable: false
  }
  // 倒计时
  settime() {
    if (this.pageConfig.countdown == 1) {
      this.pageConfig.countdown = 120;
      this.pageConfig.verifyCodeTips = "获取验证码";
      this.pageConfig.disable = true;
      this.pageConfig.account_disable = true;
      return;
    } else {
      this.pageConfig.countdown--;
    }
    this.pageConfig.verifyCodeTips = "重新获取(" + this.pageConfig.countdown + ")";
    setTimeout(() => {
      this.pageConfig.verifyCodeTips = "重新获取(" + this.pageConfig.countdown + ")";
      this.settime();
    }, 1000);
  }
  VerifyViewModel: any = {
    MobileNum: '',
    VerifyType:'1'
  }
  postMobile() {
    this.VerifyViewModel.MobileNum = this.pageModel.Account;
    this.pageConfig.disable = false;
    this.pageConfig.username_disable = false;
    this.appService.httpPost(AppGlobal.API.postIsMobile, this.VerifyViewModel, rs => {
      if (rs.isSuccess) {
        this.postverify();
      } else {
        this.pageConfig.disable = true;
    this.pageConfig.username_disable = true;
        console.log(rs.errorMessage)
        this.appConfigCtrl.popAlertView('你的手机号已被注册，请重新输入其他的手机号！');
      }
    })
  }
  postverify() {
    this.VerifyViewModel.MobileNum = this.pageModel.Account;
    this.appService.httpPost(AppGlobal.API.postVerification, this.VerifyViewModel, rs => {
      if (rs.isSuccess) {
        this.appConfigCtrl.popToastView('验证码已发送');
        //发送验证码成功后开始倒计时
        this.pageConfig.disable = false;
        this.pageConfig.username_disable = false;
        this.settime();
      } else {
        console.log(rs)
        this.appConfigCtrl.popAlertView('验证码发送失败,' + rs.errorMessage);
      }
    })
  }
  getCode() {
    if (!AppStaticConfig.verifyMobile(this.pageModel.Account)) {
      this.appConfigCtrl.popAlertView('请填写正确手机号');
      return;
    }
    this.postMobile();
  }
  getinput(event: KeyboardEvent) {
    if (this.pageModel.Account.length > 5 && this.pageModel.Account.length <= 10) {
      this.pageConfig.color = 'danger';
      this.pageConfig.outline = true;
    } else if (this.pageModel.Account.length > 10) {
      this.pageConfig.color = 'danger';
      this.pageConfig.outline = false;
      this.pageConfig.disable = true;
    } else {
      this.pageConfig.color = 'verify';
      this.pageConfig.outline = false;
      this.pageConfig.disable = false;
    }
  }
  getblur() {
    if (this.pageModel.Account.length == 0) {
      this.pageConfig.color = 'verify';
      this.pageConfig.outline = false;
      this.pageConfig.disable = false;
    }
  }
  isInputNull() {
    if (this.pageModel.CompanyName.length > 2 && this.pageModel.ClientName.length > 1 && this.pageModel.PassWord.length > 5 && this.pageModel.rePassWord_M.length > 5 && this.pageModel.Verification.length > 1) {
      this.pageConfig.btn_disable = true;
      this.pageConfig.btn_color = 'danger';
    } else {
      this.pageConfig.btn_disable = false;
      this.pageConfig.btn_color = 'verify';
    }
  }
  getinput_ve() {
    this.isInputNull();
  }
  getinput_co() {
    this.isInputNull();
  }
  getinput_cl() {
    this.isInputNull();
  }
  getinput_pw() {
    this.isInputNull();
  }
  getinput_rpw() {
    this.isInputNull();
  }
  AccountViewModel: any = {
    MobileNum: ''
  }
  register() {
    this.pageModel.Mobile = this.pageModel.Account;
    if (this.pageModel.SalesmanCode.length <= 0) {
      this.pageModel.SalesmanCode = '无';
    }
    console.log(this.pageModel.SalesmanCode.length)
    this.appService.httpPost(AppGlobal.API.postRegister, this.pageModel, rs => {
      if (rs.isSuccess) {
        this.storage.set('ClientName', this.pageModel.ClientName);
        this.storage.set('CompanyName', this.pageModel.CompanyName);
        this.storage.set('Mobile', this.pageModel.Mobile);
        this.appConfigCtrl.popAlertView('注册成功，请登录！');
        this.navCtrl.setRoot('LoginPage');
      } else {
        console.log(rs.errorMessage)
        this.appConfigCtrl.popAlertView('抱歉您的：由于当前网络不稳定，请您稍后重试！');
      }
    },true)
  }
}
