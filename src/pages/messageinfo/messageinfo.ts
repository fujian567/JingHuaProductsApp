import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { AppConfig } from '../../app/app.config';
/**
客户端：消息详细信息
 */

@IonicPage()
@Component({
  selector: 'page-messageinfo',
  templateUrl: 'messageinfo.html',
})
export class MessageinfoPage {
  c_token: any;
  pageModel: any = {
    isRead: '',
    msgAlertInfo: '',
    msgContent: '',
    msgId: '',
    msgMark: '',
    msgSendDate: '',
    msgTitle: '',
    msgTypeId: '',
    targetAccountId: ''
  }
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public app: App,
    private appConfigCtrl: AppConfig,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    if (navParams.data.item != undefined) {
      this.pageModel.msgAlertInfo = navParams.data.item.msgAlertInfo;
      this.pageModel.msgContent = navParams.data.item.msgContent;
      this.pageModel.msgId = navParams.data.item.msgId;
      this.pageModel.msgMark = navParams.data.item.msgMark;
      this.pageModel.msgSendDate = new Date(navParams.data.item.msgSendDate).toLocaleDateString();
      this.pageModel.msgTitle = navParams.data.item.msgTitle;
      this.storageCtrl.get('c_token').then((val) => {
        this.c_token = val;
        if(!navParams.data.item.isRead){
          this.setThisMessageRead(val,this.pageModel.msgId);
        }
      });
    }else{
      this.navCtrl.pop();
    }
  }

  setThisMessageRead(c_token,msgId){
    this.appService.httpPost_token(AppGlobal.API.setMessageRead, c_token, { msgId: msgId, read: true }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
    })
  }
  deteleThisMessageRead(){
    this.appService.httpPost_token(AppGlobal.API.deteleMessag, this.c_token, { msgId: this.pageModel.msgId }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('MessagelistPage');
      }else{
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    })
  }
}
