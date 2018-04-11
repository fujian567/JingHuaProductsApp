import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig ,AppStaticConfig} from '../../app/app.config';
/**
客户端：找回密码-重置密码界面
 */

@IonicPage()
@Component({
  selector: 'page-resetpwd',
  templateUrl: 'resetpwd.html',
})
export class ResetpwdPage {
  params = {
    newpwd: '',
    renewpwd: '',
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private appConfigCtrl: AppConfig,
    ) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpwdPage');
  }
  inputCode: any = {
    disable: false,
    color: 'verify'
  }
  getnewpwd(event: KeyboardEvent) {
    if (this.params.newpwd.length > 7 && this.params.renewpwd.length > 7) {
      this.inputCode.color = 'danger';
      this.inputCode.disable = true;
    }
  }
  getrenewpwd(event: KeyboardEvent) {
    if (this.params.newpwd.length > 7 && this.params.renewpwd.length > 7) {
      this.inputCode.color = 'danger';
      this.inputCode.disable = true;
    }
  }
  testcallback(){
    console.log('this is resetpwdpage')
  }
  resetpwd() {
    if (this.params.newpwd !== this.params.renewpwd) {
      this.appConfigCtrl.popAlertView('两次密码输入不一致');
      return;
    }
    if (!AppStaticConfig.verifyPassword(this.params.newpwd)) { 
      this.appConfigCtrl.popAlertConfirmLoadingView('你的密码有些简单，是否修改？','正在修改...',5000,this.testcallback())
    }
  }
}
